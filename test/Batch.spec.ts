import {
  Batch,
  Finish,
  Format,
  Order,
  PaginatedResponse,
  Template,
} from "../src";
import { client } from "./client";
import { BatchStatus } from "../src/enums/BatchStatus";

let batch: Batch = null as unknown as Batch;
let template: Template = null as unknown as Template;

beforeAll(async function () {
  template = await client.createTemplate({
    name: `Test Order ${new Date().toISOString().replaceAll(":", "-")}`,
    format: Format.POSTCARD_SQ15,
    labels: ["library-unit-test"],
    pages: ["page1", "page2"],
  });
});

beforeEach(async function () {
  batch = await client.createBatch({
    template: template,
    name: `Test Batch ${new Date().toISOString().replaceAll(":", "-")}`,
    finish: Finish.GLOSSY,
  });
});

afterAll(async function () {
  await template.delete();
});

async function addOrders(count: number): Promise<void> {
  await Promise.all(
    Array.from(Array(count)).map(() =>
      batch.createOrder({
        recipient: {
          name: "John Doe",
          address: "123 Main Street",
          postalCode: "1234 AB",
          city: "Anytown",
          country: "Nederland",
        },
      }),
    ),
  );
}

describe("createOrder", function () {
  it("should create an order to the batch", async function () {
    // arrange

    // act
    const order = await batch.createOrder({
      recipient: {
        name: "John Doe",
        address: "123 Main Street",
        postalCode: "1234 AB",
        city: "Anytown",
        country: "Nederland",
      },
    });

    // assert
    expect(order).toBeDefined();
    expect(order).toBeInstanceOf(Order);
    expect((await batch.getOrders()).meta.total).toEqual(1);
  });

  it("should return status needs approval with 300+ orders", async function () {
    // arrange
    await addOrders(300);

    // act
    await batch.refresh();

    // assert
    expect(batch.status).toEqual(BatchStatus.batch_needs_approval);
    expect(
      batch.orders.processing + batch.orders.success + batch.orders.failed,
    ).toEqual(300);
  }, 20000);
});

describe("update", function () {
  describe("ready", function () {
    it("should update the batch to ready", async function () {
      // arrange

      // act
      await batch.update({
        ready: true,
      });

      // assert
      expect(batch.status).toEqual(BatchStatus.batch_user_ready);
      expect(batch.sendDate).toBeInstanceOf(Date);
    });

    it("should update the batch to be ready in the future", async function () {
      // arrange
      const date = new Date();
      date.setDate(date.getDate() + 36);

      // act
      await batch.update({
        ready: date,
      });

      // assert
      expect(batch.status).toEqual(BatchStatus.batch_user_ready);
      expect(batch.sendDate).toBeInstanceOf(Date);
      expect(batch.sendDate?.getDay()).toEqual(date.getDay());
    });

    it("should update the batch to not ready", async function () {
      // arrange
      await batch.update({
        ready: true,
      });

      // act
      await batch.update({
        ready: false,
      });

      // assert
      expect(batch.status).toEqual(BatchStatus.batch_created);
      expect(batch.sendDate).toBeUndefined();
    });

    it("should update the updatedAt date", async function () {
      // arrange
      const updatedAt = batch.updatedAt;

      // act
      await batch.update({
        ready: true,
      });

      // assert
      expect(batch.updatedAt).toBeAfterOrEqualTo(updatedAt);
    });

    it("should get status ready to sent with 300+ orders", async function () {
      // arrange
      await addOrders(300);

      // act
      await batch.update({
        ready: true,
      });

      // assert
      expect(batch.status).toEqual(BatchStatus.batch_ready_to_schedule);
    }, 20000);
  });
});

describe("getTemplate", function () {
  it("should return the template", async function () {
    // arrange

    // act
    const result = await batch.getTemplate();

    // assert
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Template);
    expect(result.id).toEqual(template.id);
  });
});

describe("refresh", function () {
  it("should refresh the batch data", async function () {
    // arrange
    const batch2 = await client.getBatch(batch.id);
    await batch2.update({ ready: true });

    // act
    await batch.refresh();

    // assert
    expect(batch.status).toEqual(BatchStatus.batch_user_ready);
  });
});

describe("getOrder", function () {
  it("should return the order", async function () {
    // arrange
    const order = await batch.createOrder({
      recipient: {
        name: "John Doe",
        address: "123 Main Street",
        postalCode: "1234 AB",
        city: "Anytown",
        country: "Nederland",
      },
    });

    // act
    const result = await batch.getOrder(order.id);

    // assert
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Order);
    expect(result.id).toEqual(order.id);
  });

  it("should not return an non batch order", async function () {
    // arrange
    const order = await client.createOrder({
      recipient: {
        name: "John Doe",
        address: "123 Main Street",
        postalCode: "1234 AB",
        city: "Anytown",
        country: "Nederland",
      },
      template: template,
    });

    // act
    const result = batch.getOrder(order.id);

    // assert
    await expect(result).toReject();
  });

  it("should not return an order from another batch", async function () {
    // arrange
    const batch2 = await client.createBatch({
      template: template,
      name: `Test Batch ${new Date().toISOString().replaceAll(":", "-")}`,
      finish: Finish.GLOSSY,
    });
    const order = await batch2.createOrder({
      recipient: {
        name: "John Doe",
        address: "123 Main Street",
        postalCode: "1234 AB",
        city: "Anytown",
        country: "Nederland",
      },
    });

    // act
    const result = batch.getOrder(order.id);

    // assert
    await expect(result).toReject();
  });

  it("should not return a non existing order", async function () {
    // arrange

    // act
    const result = batch.getOrder("non-existing");

    // assert
    await expect(result).toReject();
  });
});

describe("getOrders", function () {
  it("should return the orders", async function () {
    // arrange
    await addOrders(5);

    // act
    const result = await batch.getOrders();

    // assert
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(PaginatedResponse);
    expect(result.data).toBeArrayOfSize(5);
  });

  it("should return the orders with a filter", async function () {
    // arrange
    await addOrders(5);

    // act
    const result = await batch.getOrders({
      limit: 1,
    });

    // assert
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(PaginatedResponse);
    expect(result.data).toBeArrayOfSize(1);
  });
});
