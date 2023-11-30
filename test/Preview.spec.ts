import { Format, Preview, PreviewDetails, Template } from "../src";
import { client } from "./client";

let template: Template = null as unknown as Template;
let preview: Preview[] = [];

beforeEach(async function () {
  template = await client.createTemplate({
    name: `Test Details ${new Date().toISOString().replaceAll(":", "-")}`,
    format: Format.POSTCARD_SQ15,
    labels: ["library-unit-test"],
    pages: ["page1", "page2"],
  });

  preview = await template.preview();
});

afterEach(async function () {
  await template.delete();
});

describe("fields", function () {
  it("should have all fields", async function () {
    // arrange

    // act

    // assert
    expect(preview).toEqual(expect.any(Array));
    expect(preview.length).toBeGreaterThanOrEqual(2);

    for (const page of preview) {
      expect(page.url).toEqual(expect.any(String));
      expect(page.detailsUrl).toEqual(expect.any(String));
      expect(page.orderingKey).toEqual(expect.any(Number));
    }
  });
});

describe("getDetails()", function () {
  it("should return details", async function () {
    // arrange

    // act
    const details = await preview[0].getDetails();

    // assert
    expect(details).toEqual(expect.any(PreviewDetails));
    expect(details.id).toEqual(expect.any(String));
    expect(details.imageUrl).toEqual(expect.any(String));
    expect(details.errors).toEqual(expect.any(Array));
  }, 30000);

  it("should throw an error with no polling", async function () {
    // arrange

    // act
    const getDetails = preview[0].getDetails(false);

    // assert
    await expect(getDetails).rejects.toThrowError();
  }, 30000);

  it("should download the same as .download()", async function () {
    // arrange

    // act
    const details = await preview[0].getDetails();
    const download = await preview[0].download();

    // assert
    expect(download).toEqual(await details.download());
  }, 30000);

  it("should throw an timeout error if timeout is reached", async function () {
    // arrange

    // act
    const details = preview[0].getDetails(true, 0);

    // assert
    await expect(details).rejects.toThrowError();
  });
});

describe("download()", function () {
  it("should download the preview", async function () {
    // arrange

    // act
    const download = await preview[0].download();

    // assert
    expect(download).toEqual(expect.any(Uint8Array));
  }, 30000);

  it("should throw an error with no polling", async function () {
    // arrange

    // act
    const download = preview[0].download(false);

    // assert
    await expect(download).rejects.toThrowError();
  }, 30000);

  it("should throw an timeout error if timeout is reached", async function () {
    // arrange

    // act
    const download = preview[0].download(true, 0);

    // assert
    await expect(download).rejects.toThrowError();
  });

  it("should download the same as .getDetails()", async function () {
    // arrange

    // act
    const details = await preview[0].getDetails();
    const download = await preview[0].download();

    // assert
    expect(download).toEqual(await details.download());
  }, 30000);
});
