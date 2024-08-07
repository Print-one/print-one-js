import { Format, Order, Protected, Template } from "../src";
import { client } from "./client";
import { sleep } from "../src/utils";
import { IOrder } from "../src/models/_interfaces/IOrder";

let order: Order = null as unknown as Order;
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
  order = await client.createOrder({
    recipient: {
      name: "John Doe",
      address: "123 Main Street",
      postalCode: "1234 AB",
      city: "Anytown",
      country: "Nederland",
    },
    template: template,
  });
});

afterAll(async function () {
  await template.delete();
});

describe("getTemplate", function () {
  it("should get the template", async function () {
    // arrange

    // act
    const temp = await order.getTemplate();

    // assert
    expect(temp).toBeInstanceOf(Template);
    expect(temp.id).toEqual(template.id);
  });
});

describe("refresh", function () {
  it("should refresh the order", async function () {
    // precondition
    expect(order.status).toEqual("order_created");

    // arrange

    // act
    while (order.status === "order_created") {
      await order.refresh();
      await sleep(1000);
    }

    // assert
    expect(order.status).not.toEqual("order_created");
  }, 30000);
});

describe("download", function () {
  it("should download the preview", async function () {
    // arrange

    // act
    const buffer = await order.download();

    // assert
    expect(buffer).toBeInstanceOf(Uint8Array);
    expect(buffer.byteLength).toBeGreaterThan(0);
  }, 30000);

  it("should throw an error when no polling", async function () {
    // arrange

    // act
    const download = order.download(false);

    // assert
    await expect(download).rejects.toThrow();
  }, 10000);
});

describe("cancel", function () {
  it("should cancel the order", async function () {
    // arrange

    // act
    await order.cancel();

    // assert
    expect(order.status).toEqual("order_cancelled");
  }, 30000);
});

describe("fields", function () {
  describe("anonymizedAt", function () {
    it("should be undefined if not anonymized", function () {
      // arrange
      const order = new Order(
        null as unknown as Protected,
        { anonymizedAt: null } as Partial<IOrder> as IOrder,
      );

      // act

      // assert
      expect(order.anonymizedAt).toBeUndefined();
    });

    it("should be a date if anonymized", function () {
      // arrange
      const order = new Order(
        null as unknown as Protected,
        { anonymizedAt: new Date().toISOString() } as Partial<IOrder> as IOrder,
      );

      // act

      // assert
      expect(order.anonymizedAt).toBeInstanceOf(Date);
    });
  });
});
