import {
  Address,
  Batch,
  CreateBatchCsvOrder,
  CsvOrder,
  Finish,
  Format,
  Order,
  PaginatedResponse,
  Template,
} from "../src";
import { client } from "./client";
import { BatchStatus } from "../src/enums/BatchStatus";
import * as fs from "fs";
import * as path from "path";
import { sleep } from "../src/utils";

let batch: Batch = null as unknown as Batch;
let template: Template = null as unknown as Template;

const address: Address = {
  name: "Jane Doe",
  address: "123 Main Street",
  postalCode: "1234 AB",
  city: "Somecity",
  country: "NL",
};

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
    sender: address,
  });
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

describe("createCsvOrder", function () {
  let file: ArrayBuffer = null as unknown as ArrayBuffer;

  const mapping: CreateBatchCsvOrder["mapping"] = {
    recipient: {
      name: "{{FirstName}} {{LastName}}",
      addressLine2: "Financial Dpt.",
      address: "{{Street}} {{HouseNr}}",
      postalCode: "{{ZIP}}",
      city: "{{City}}",
      country: "{{Country}}",
    },
  };

  beforeAll(() => {
    file = fs.readFileSync(path.join(__dirname, "assets/test.csv"));
  });

  it("should create a csv order with all fields", async function () {
    // arrange

    // act
    const csvOrder = await batch.createCsvOrder({
      mapping: mapping,
      file: file,
    });

    // assert
    expect(csvOrder).toBeDefined();
    expect(csvOrder).toEqual(expect.any(CsvOrder));

    expect(csvOrder.id).toEqual(expect.any(String));
    expect(csvOrder.status).toEqual(expect.any(String));
    expect(csvOrder.createdAt).toEqual(expect.any(Date));
    expect(csvOrder.updatedAt).toEqual(expect.any(Date));
    // if sendDate is undefined, it should be today
    expect(csvOrder.sendDate.getDay()).toEqual(new Date().getDay());
    expect(csvOrder.friendlyStatus).toEqual(expect.any(String));
    expect(csvOrder.sender).toEqual(undefined);
    expect(csvOrder.format).toEqual(expect.any(String));
    expect(csvOrder.recipientMapping).toEqual(mapping.recipient);
    expect(csvOrder.templateId).toEqual(template.id);
    expect(csvOrder.mergeVariableMapping).toStrictEqual({});
    expect(csvOrder.billingId).toEqual(
      expect.toBeOneOf([undefined, expect.any(String)]),
    );
    expect(csvOrder.finish).toEqual(expect.any(String));
    expect(csvOrder.format).toEqual(expect.any(String));
    expect(csvOrder.isBillable).toEqual(expect.any(Boolean));
    expect(csvOrder.estimatedOrderCount).toEqual(expect.any(Number));
    expect(csvOrder.failedOrderCount).toEqual(expect.any(Number));
    expect(csvOrder.processedOrderCount).toEqual(expect.any(Number));
    expect(csvOrder.totalOrderCount).toEqual(expect.any(Number));
  });
});

describe("getCsvOrder", function () {
  let csvOrderId: string = null as unknown as string;
  const mapping: CreateBatchCsvOrder["mapping"] = {
    recipient: {
      name: "{{FirstName}} {{LastName}}",
      address: "{{Street}} {{HouseNr}}",
      postalCode: "{{ZIP}}",
      city: "{{City}}",
      country: "{{Country}}",
    },
  };

  beforeAll(async () => {
    const file = fs.readFileSync(path.join(__dirname, "assets/test.csv"));

    const csvOrder = await batch.createCsvOrder({
      mapping: mapping,
      file: file,
    });

    csvOrderId = csvOrder.id;
  });

  it("should get a csv order with all fields", async function () {
    // arrange

    // act
    const csvOrder = await batch.getCsvOrder(csvOrderId);

    // assert
    expect(csvOrder).toBeDefined();
    expect(csvOrder.id).toEqual(expect.any(String));
    expect(csvOrder.status).toEqual(expect.any(String));
    expect(csvOrder.createdAt).toEqual(expect.any(Date));
    expect(csvOrder.updatedAt).toEqual(expect.any(Date));
    // if sendDate is undefined, it should be today
    expect(csvOrder.sendDate.getDay()).toEqual(new Date().getDay());
    expect(csvOrder.friendlyStatus).toEqual(expect.any(String));
    expect(csvOrder.sender).toEqual(undefined);
    expect(csvOrder.recipientMapping).toEqual(mapping.recipient);
    expect(csvOrder.templateId).toEqual(template.id);
    expect(csvOrder.mergeVariableMapping).toStrictEqual({});
    expect(csvOrder.billingId).toBeOneOf([undefined, expect.any(String)]);
    expect(csvOrder.finish).toEqual(expect.any(String));
    expect(csvOrder.format).toEqual(expect.any(String));
    expect(csvOrder.isBillable).toEqual(expect.any(Boolean));
    expect(csvOrder.estimatedOrderCount).toEqual(expect.any(Number));
    expect(csvOrder.failedOrderCount).toEqual(expect.any(Number));
    expect(csvOrder.processedOrderCount).toEqual(expect.any(Number));
    expect(csvOrder.totalOrderCount).toEqual(expect.any(Number));
  });
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
    expect(result.batchId).toEqual(batch.id);
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
      sender: address,
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

describe("BatchOrder", function () {
  it("should be able to cancel Order", async function () {
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
    await order.cancel();

    // assert
    expect(order.status).toEqual("order_cancelled");
  }, 30000);

  it("should be able to refresh Order", async function () {
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
    while (order.status === "order_created") {
      await order.refresh();
      await sleep(1000);
    }

    // assert
    expect(order.status).not.toEqual("order_created");
  }, 30000);
});
