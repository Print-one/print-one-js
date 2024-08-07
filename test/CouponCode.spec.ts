import { Coupon, CouponCode, Format, Order } from "../src";
import { client } from "./client";
import * as fs from "fs";
import * as path from "path";

let coupon: Coupon = null as unknown as Coupon;
let couponCode: CouponCode = null as unknown as CouponCode;
let file: ArrayBuffer;

beforeAll(function () {
  file = fs.readFileSync(path.join(__dirname, "assets/single-code.csv"));
});

beforeEach(async function () {
  coupon = await client.createCoupon({
    name: `Test Coupon`,
  });

  await coupon.addCodes(file);

  couponCode = (await coupon.getCodes()).data[0];
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
      address: "123 Main Street",
      postalCode: "1234 AB",
      city: "Anytown",
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
    await couponCode.refresh();

    // act
    const order = await couponCode.getOrder();

    // assert
    expect(order).toBeDefined();
    expect(order).toBeInstanceOf(Order);
    expect(order?.id).toBe(orderId);
  });
});
