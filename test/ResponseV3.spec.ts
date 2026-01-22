import { PaginatedResponseV3 } from "~/models/Response.v3";
import { Campaign } from "~/index";
import { v3Client } from "./client";

let pageOne: PaginatedResponseV3<Campaign> =
  null as unknown as PaginatedResponseV3<Campaign>;

beforeEach(async function () {
  pageOne = await v3Client.getCampaigns({
    limit: 1,
  });

  if (pageOne.meta.totalItems < 3) {
    throw new Error("Not enough campaigns to test pagination");
  }
});

describe("fields", function () {
  it("should have all fields", async function () {
    // arrange

    // act

    // assert
    expect(pageOne.data).toEqual(expect.any(Array));
    expect(pageOne.meta).toStrictEqual({
      itemsPerPage: expect.any(Number),
      totalItems: expect.any(Number),
      currentPage: expect.any(Number),
      totalPages: expect.any(Number),
      filterOptions: expect.any(Object),
    });
    expect(pageOne.links).toStrictEqual({
      first: null,
      previous: null,
      current: expect.any(String),
      next: expect.any(String),
      last: expect.any(String),
    });
  });
});

describe("first()", function () {
  it("should return the first page", async function () {
    // arrange

    // act
    const next = await pageOne.next();

    // assert
    expect(next).toEqual(expect.any(PaginatedResponseV3));
    expect(next?.meta.currentPage).toEqual(2);
    expect(next?.links.previous).toEqual(pageOne.links.current);
  });

  it("should return null on the first page", async function () {
    // arrange

    // act
    const first = await pageOne.first();

    // assert
    expect(first).toEqual(null);
  });
});

describe("previous()", function () {
  it("should return the previous page", async function () {
    // arrange

    // act
    const previous = await pageOne.next();
    const prev = await previous?.previous();

    // assert
    expect(prev).toEqual(expect.any(PaginatedResponseV3));
    expect(prev?.meta.currentPage).toEqual(1);
  });

  it("should return null if there is no previous page", async function () {
    // arrange

    // act
    const prev = await pageOne.previous();

    // assert
    expect(prev).toEqual(null);
  });
});

describe("next()", function () {
  it("should return the next page", async function () {
    // arrange

    // act
    const next = await pageOne.next();

    // assert
    expect(next).toEqual(expect.any(PaginatedResponseV3));
    expect(next?.meta.currentPage).toEqual(2);
  });

  it("should return null if there is no next page", async function () {
    // arrange
    const lastPage = await pageOne.last();

    // act
    const next = await lastPage?.next();

    // assert
    expect(next).toEqual(null);
  });
});

describe("last()", function () {
  it("should return the last page", async function () {
    // arrange

    // act
    const last = await pageOne.last();

    // assert
    expect(last).toEqual(expect.any(PaginatedResponseV3));
    expect(last?.meta.currentPage).toEqual(last?.meta.totalPages);
  });

  it("should return null on the last page", async function () {
    // arrange
    const lastPage = await pageOne.last();

    // act
    const last = await lastPage?.last();

    // assert
    expect(last).toEqual(null);
  });
});
