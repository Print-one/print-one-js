import { Company, CustomFile, PaginatedResponse, PrintOne } from "../src";
import * as process from "process";
import "jest-extended";
import * as fs from "fs";
import * as path from "path";

let client: PrintOne = null as unknown as PrintOne;

beforeAll(async function () {
  client = new PrintOne(process.env.API_KEY ?? "", {
    url: process.env.API_URL,
  });

  // Ensure at least one custom file exists
  const files = await client.getCustomFiles();

  if (files.meta.total === 0) {
    const file = await client.uploadCustomFile(
      "test.png",
      fs.readFileSync(path.join(__dirname, "assets/test.png")),
    );

    expect(file).toBeDefined();
  }
});

describe("getSelf", function () {
  it("should return a company", async function () {
    // arrange

    // act
    const company = await client.getSelf();

    // assert
    expect(company).toBeDefined();
    expect(company).toEqual(expect.any(Company));
  });

  it("should return a company with all fields", async function () {
    // arrange

    // act
    const company = await client.getSelf();

    // assert
    expect(company).toBeDefined();
    expect(company.id).toEqual(expect.any(String));
    expect(company.firstName).toEqual(expect.any(String));
    expect(company.lastName).toEqual(expect.any(String));
    expect(company.email).toEqual(expect.any(String));
    expect(company.invoiceEmail).toEqual(expect.any(String));
    expect(company.financialContactEmail).toEqual(expect.any(String));
    expect(company.financialContactName).toEqual(expect.any(String));
    expect(company.technicalContactEmail).toEqual(expect.any(String));
    expect(company.technicalContactName).toEqual(expect.any(String));
    expect(company.phoneNumber).toEqual(expect.any(String));
    expect(company.companyName).toEqual(expect.any(String));
    expect(company.street).toEqual(expect.any(String));
    expect(company.houseNumber).toEqual(expect.any(String));
    expect(company.country).toEqual(expect.any(String));
    expect(company.postalCode).toEqual(expect.any(String));
    expect(company.city).toEqual(expect.any(String));
    expect(company.cocNumber).toEqual(expect.any(String));
    expect(company.vatNumber).toEqual(expect.any(String));
    expect(company.iban).toEqual(expect.any(String));
    expect(company.canBeBilled).toEqual(expect.any(Boolean));
    expect(company.createdAt).toEqual(expect.any(Date));
    expect(company.updatedAt).toEqual(expect.any(Date));
    expect(company.emailVerifiedAt).toEqual(
      expect.toBeOneOf([undefined, expect.any(Date)]),
    );
  });
});

describe("getCustomFiles", function () {
  it("should return a paginated response", async function () {
    // arrange

    // act
    const files = await client.getCustomFiles();

    // assert
    expect(files).toBeDefined();
    expect(files).toEqual(expect.any(PaginatedResponse));

    expect(files.data).toBeDefined();
    expect(files.data.length).toBeGreaterThanOrEqual(1);

    expect(files.meta.total).toBeGreaterThanOrEqual(1);
    expect(files.meta.page).toEqual(1);
    // Default page size is 10
    expect(files.meta.pageSize).toBeGreaterThanOrEqual(10);
    expect(files.meta.pages).toBeGreaterThanOrEqual(1);
  });

  it("should return a paginated response with the correct amount of files", async function () {
    // arrange

    // act
    const files = await client.getCustomFiles({ limit: 1 });

    // assert
    expect(files).toBeDefined();
    expect(files).toEqual(expect.any(PaginatedResponse));

    expect(files.data).toBeDefined();
    expect(files.data.length).toEqual(1);

    expect(files.meta.total).toBeGreaterThanOrEqual(1);
    expect(files.meta.page).toEqual(1);
    expect(files.meta.pageSize).toEqual(1);
    expect(files.meta.pages).toBeGreaterThanOrEqual(1);
  });

  it("should return a custom file", async function () {
    // arrange

    // act
    const files = await client.getCustomFiles({ limit: 1 });
    const file = files.data[0];

    // assert
    expect(file).toBeDefined();
    expect(file).toEqual(expect.any(CustomFile));
  });

  it("should return a custom file with all fields", async function () {
    // arrange

    // act
    const files = await client.getCustomFiles({ limit: 1 });
    const file = files.data[0];

    // assert
    expect(file.id).toEqual(expect.any(String));
    expect(file.fileName).toEqual(expect.any(String));
    expect(file.fileExtension).toEqual(expect.any(String));
    expect(file.size).toEqual(expect.any(Number));
    expect(file.createdAt).toEqual(expect.any(Date));
  });
});

describe("uploadCustomFile", function () {
  it("should upload a file", async function () {
    // arrange
    const file = fs.readFileSync(path.join(__dirname, "assets/test.png"));

    // act
    const customFile = await client.uploadCustomFile("test.png", file);

    // assert
    expect(customFile).toBeDefined();
    expect(customFile).toEqual(expect.any(CustomFile));
  });

  it("should upload a file with all fields", async function () {
    // arrange
    const file = fs.readFileSync(path.join(__dirname, "assets/test.png"));

    // act
    const customFile = await client.uploadCustomFile("test.png", file);

    // assert
    expect(customFile).toBeDefined();
    expect(customFile.id).toEqual(expect.any(String));
    expect(customFile.fileName).toEqual("test.png");
    expect(customFile.fileExtension).toEqual("png");
    expect(customFile.size).toEqual(1024);
    expect(customFile.createdAt).toEqual(expect.any(Date));
  });
});
