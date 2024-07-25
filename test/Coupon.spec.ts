import { Coupon, PaginatedResponse, PrintOneError } from "../src";
import { client } from "./client";
import * as fs from "fs";
import * as path from "path";

let coupon: Coupon = null as unknown as Coupon;
let file: ArrayBuffer;

beforeAll(function () {
  file = fs.readFileSync(path.join(__dirname, "assets/codes.csv"));
});

beforeEach(async function () {
  coupon = await client.createCoupon({
    name: `Test Coupon`,
  });
});

describe("refresh", function () {
  it("should refresh the coupon", async function () {
    // precondition
    expect(coupon.stats.total).toEqual(0);

    // arrange
    await coupon.addCodes(file);

    // act
    await coupon.refresh();

    // assert
    expect(coupon.stats.total).toBe(25);
  }, 30000);
});

describe("delete", function () {
  it("should delete the order", async function () {
    // arrange

    // act
    await coupon.delete();

    // assert
    await expect(client.getCoupon(coupon.id)).rejects.toThrow(PrintOneError);
  }, 30000);
});

describe("addCodes", function () {
  it("should increase coupons total", async function () {
    // arrange
    await coupon.addCodes(file);

    // act
    await coupon.refresh();

    // assert
    expect(coupon.stats.total).toBe(25);
  });
});

describe("getCodes", function () {
  beforeEach(async function () {
    await coupon.addCodes(file);
  });

  it("should return a paginated response", async function () {
    // arrange

    // act
    const codes = await coupon.getCodes();

    // assert
    expect(codes).toBeDefined();
    expect(codes).toEqual(expect.any(PaginatedResponse));

    expect(codes.data).toBeDefined();
    expect(codes.data.length).toBeGreaterThanOrEqual(1);

    expect(codes.meta.total).toBeGreaterThanOrEqual(1);
    expect(codes.meta.page).toEqual(1);
    // Default page size is 10
    expect(codes.meta.pageSize).toBeGreaterThanOrEqual(10);
    expect(codes.meta.pages).toBeGreaterThanOrEqual(1);
  });

  it("should return a coupon code with all fields", async function () {
    // act
    const coupons = await coupon.getCodes();
    const couponCode = coupons.data[0];

    // assert
    expect(couponCode.id).toEqual(expect.any(String));
    expect(couponCode.couponId).toEqual(expect.any(String));
    expect(couponCode.code).toEqual(expect.any(String));
    expect(couponCode.used).toEqual(expect.any(Boolean));
    expect(couponCode.usedAt).toEqual(null);
    expect(couponCode.orderId).toEqual(null);
  });
});

describe("getCode", function () {
  it("should get code by id", async function () {
    //arrange
    await coupon.addCodes(file);
    const codes = await coupon.getCodes();
    const codeId = codes.data[0].id;

    //act
    const code = await coupon.getCode(codeId);

    //assert
    expect(code.couponId).toBe(coupon.id);
  });

  it("should throw error if code does not exist", async function () {
    //act
    const response = coupon.getCode("test");

    //assert
    await expect(response).rejects.toThrow(PrintOneError);
  });
});
