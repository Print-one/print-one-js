import { Format, Preview, Template } from "../src";
import { client } from "./client";

let template: Template = null as unknown as Template;

beforeEach(async function () {
  template = await client.createTemplate({
    name: `Test Template ${new Date().toISOString().replaceAll(":", "-")}`,
    format: Format.POSTCARD_SQ15,
    labels: ["library-unit-test"],
    pages: ["page1", "page2"],
  });

  // ensure the template is unloaded
  template = (
    await client.getTemplates({
      filter: {
        name: template.name,
      },
    })
  ).data[0];
});

afterEach(async function () {
  await template.delete();
});

describe("fields", function () {
  it("should have all fields", async function () {
    // arrange

    // act

    // assert
    expect(template.id).toEqual(expect.any(String));
    expect(template.name).toEqual(expect.any(String));
    expect(template.format).toEqual(expect.any(String));
    expect(template.labels).toEqual(expect.any(Array));
    expect(template.mergeVariables).toEqual(expect.any(Array));
    expect(template.thumbnail).toEqual(expect.any(String));
    expect(template.apiVersion).toEqual(expect.any(Number));
    expect(template.version).toEqual(expect.any(Number));
    expect(template.updatedAt).toEqual(expect.any(Date));
  });

  describe("after load", function () {
    beforeEach(async function () {
      await template.load();
    });

    it("should load the pages", async function () {
      // arrange

      // act

      // assert
      expect(template.pages).toEqual(expect.any(Array));
      expect(template.pages.length).toBeGreaterThanOrEqual(2);

      for (const page of template.pages) {
        expect(page).toEqual(expect.any(String));
      }
    });
  });
});

describe("load", function () {
  it("should load the template", async function () {
    // arrange

    // act
    await template.load();

    // assert
    expect(template.pages).toBeDefined();
  });
});

describe("preview", function () {
  it("should return a Preview array", async function () {
    // arrange

    // act
    const previews = await template.preview();

    // assert
    expect(previews).toEqual(expect.any(Array));
    expect(previews.length).toBeGreaterThanOrEqual(1);
    expect(previews[0]).toEqual(expect.any(Preview));
  });
});
