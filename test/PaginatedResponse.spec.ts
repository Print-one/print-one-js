import { PaginatedResponse, Template } from "../src";
import { client } from "./client";

let paginated: PaginatedResponse<Template> =
  null as unknown as PaginatedResponse<Template>;

beforeEach(async function () {
  paginated = await client.getTemplates({
    limit: 1,
  });

  if (paginated.meta.total < 3) {
    throw new Error("Not enough orders to test pagination");
  }
});

describe("fields", function () {
  it("should have all fields", async function () {
    // arrange

    // act

    // assert
    expect(paginated).toEqual(expect.any(PaginatedResponse));
    expect(paginated.data).toEqual(expect.any(Array));
    expect(paginated.data.length).toEqual(1);

    expect(paginated.meta).toEqual(expect.any(Object));
    expect(paginated.meta.total).toEqual(expect.any(Number));
    expect(paginated.meta.pages).toEqual(expect.any(Number));
    expect(paginated.meta.page).toEqual(1);
    expect(paginated.meta.pageSize).toEqual(1);
    expect(paginated.meta.filterOptions).toEqual(expect.any(Object));

    expect(paginated.links).toEqual(expect.any(Object));
    expect(paginated.links.currentUrl).toEqual(expect.any(String));
    expect(paginated.links.nextUrl).toEqual(expect.any(String));
    expect(paginated.links.previousUrl).toEqual(null);
  });
});

describe("next()", function () {
  it("should return the next page", async function () {
    // arrange

    // act
    const next = await paginated.next();

    // assert
    expect(next).toEqual(expect.any(PaginatedResponse));
    expect(next?.meta.page).toEqual(2);
    expect(next?.links.previousUrl).toEqual(expect.any(String));
  });

  it("should return null if there is no next page", async function () {
    // arrange
    const pag = await client.getTemplates({
      limit: 1,
      page: paginated.meta.pages,
    });

    // act
    const nextNext = await pag?.next();

    // assert
    expect(nextNext?.meta.pages).toEqual(undefined);
  });
});

describe("previous()", function () {
  it("should return the previous page", async function () {
    // arrange

    // act
    const previous = await paginated.next();
    const prev = await previous?.previous();

    // assert
    expect(prev).toEqual(expect.any(PaginatedResponse));
    expect(prev?.meta.page).toEqual(1);
  });

  it("should return null if there is no previous page", async function () {
    // arrange

    // act
    const prev = await paginated.previous();

    // assert
    expect(prev?.meta.pages).toEqual(undefined);
  });
});
