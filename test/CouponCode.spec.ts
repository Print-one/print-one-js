import { Coupon, CouponCode, Format, Order } from "../src";
import { client } from "./client";

let coupon: Coupon = null as unknown as Coupon;
let couponCode: CouponCode = null as unknown as CouponCode;
let file: Uint8Array;

beforeEach(function () {
  file = Buffer.from(
    [...new Array(2)].map(() => Math.random().toString(36) + "\n").join(""),
  );
});

beforeEach(async function () {
  coupon = await client.createCoupon({
    name: `Test Coupon`,
  });

  await coupon.addCodes(file);

  couponCode = (await coupon.getCodes()).data[0];
});

afterEach(async function () {
  await coupon.delete().catch(() => null);
});

const useCoupon = async function () {
  const template = await client.createTemplate({
    name: `Test Order ${new Date().toISOString().replaceAll(":", "-")}`,
    format: Format.POSTCARD_SQ15,
    labels: ["library-unit-test"],
    pages: ["{{get-coupon couponId}}", "page2"],
  });

  return await client.createOrder({
    recipient: {
      name: "John Doe",
      address: "Houtmarkt 1",
      postalCode: "2011 AL",
      city: "Haarlem",
      country: "Nederland",
    },
    template: template,
    mergeVariables: {
      couponId: coupon.id,
    },
  });
};

describe("refresh", function () {
  it("should refresh the coupon code", async function () {
    // precondition
    expect(couponCode.used).toBe(false);
    expect(couponCode.orderId).toBe(null);
    expect(couponCode.usedAt).toBe(null);

    // arrange
    const order = await useCoupon();

    if (order.isBillable === false) {
      console.warn("Order is not billable, and thus won't use a coupon code");
      return;
    }

    // act
    await couponCode.refresh();

    // assert
    expect(couponCode.used).toBe(true);
    expect(couponCode.orderId).toBe(order.id);
    expect(couponCode.usedAt).toBeInstanceOf(Date);
  }, 30000);
});

describe("getOrder", function () {
  it("should return null if coupon code is not used yet", async function () {
    // act
    const order = await couponCode.getOrder();

    // assert
    expect(order).toBe(null);
  });

  it("should return order when coupon code is used", async function () {
    // arrange
    const preOrder = await useCoupon();
    const orderId = preOrder.id;

    if (preOrder.isBillable === false) {
      console.warn("Order is not billable, and thus won't use a coupon code");
      return;
    }

    await couponCode.refresh();

    // act
    const order = await couponCode.getOrder();

    // assert
    expect(order).toBeDefined();
    expect(order).toBeInstanceOf(Order);
    expect(order?.id).toBe(orderId);
  });
});
