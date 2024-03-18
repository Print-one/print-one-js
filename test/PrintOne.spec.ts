import {
  Address,
  Company,
  CreateCsvOrder,
  CsvOrder,
  CustomFile,
  Finish,
  Format,
  FriendlyStatus,
  Order,
  PaginatedResponse,
  Template,
} from "../src";
import "jest-extended";
import * as fs from "fs";
import * as path from "path";
import { client } from "./client";
import { Batch } from "../src/models/Batch";
import { BatchStatus } from "../src/enums/BatchStatus";

let template: Template = null as unknown as Template;

beforeAll(async function () {
  // Ensure at least one custom file exists
  const files = await client.getCustomFiles();

  if (files.meta.total === 0) {
    const file = await client.uploadCustomFile(
      "placeholder.png",
      fs.readFileSync(path.join(__dirname, "assets/test.png")),
    );

    expect(file).toBeDefined();
  }

  // Ensure a template exists
  template = await client.createTemplate({
    name: "Global test template",
    format: Format.POSTCARD_SQ15,
    labels: ["library-unit-test"],
    pages: ["page1", "page2"],
  });
});

afterAll(async function () {
  if (template) {
    await template.delete();
  }
});

const exampleAddress: Address = {
  name: "Test",
  address: "Test 1",
  addressLine2: undefined,
  postalCode: "1234 AB",
  city: "Test",
  country: "NL",
};

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
  let customFile: CustomFile | null = null;

  // teardown
  afterEach(async function () {
    if (customFile) {
      await customFile.delete();
    }
  });

  it("should upload a file", async function () {
    // arrange
    const file = fs.readFileSync(path.join(__dirname, "assets/test.png"));

    // act
    customFile = await client.uploadCustomFile("test.png", file);

    // assert
    expect(customFile).toBeDefined();
    expect(customFile).toEqual(expect.any(CustomFile));
  });

  it("should upload a file with all fields", async function () {
    // arrange
    const file = fs.readFileSync(path.join(__dirname, "assets/test.png"));

    // act
    customFile = await client.uploadCustomFile("test.png", file);

    // assert
    expect(customFile).toBeDefined();
    expect(customFile.id).toEqual(expect.any(String));
    expect(customFile.fileName).toEqual("test.png");
    expect(customFile.fileExtension).toEqual("png");
    expect(customFile.size).toEqual(expect.any(Number));
    expect(customFile.createdAt).toEqual(expect.any(Date));
  });
});

describe("createTemplate", function () {
  it("should create an template with all fields", async function () {
    // arrange
    const templateName = "createTemplate()";
    const templateFormat = Format.POSTCARD_SQ15;
    const templateLabels = ["label"];
    const templatePages = ["page1", "page2"];

    // act
    const template = await client.createTemplate({
      name: templateName,
      format: templateFormat,
      labels: templateLabels,
      pages: templatePages,
    });

    // assert
    expect(template).toBeDefined();
    expect(template).toEqual(expect.any(Template));
    expect(template.id).toEqual(expect.any(String));
    expect(template.name).toEqual(templateName);
    expect(template.format).toEqual(templateFormat);
    expect(template.labels).toEqual(templateLabels);
    expect(template.mergeVariables).toEqual([]);
    expect(template.pages).toEqual(templatePages);
    expect(template.updatedAt).toEqual(expect.any(Date));
    expect(template.version).toEqual(expect.any(Number));

    // teardown
    await template.delete();
  });

  it("should not create a template with 1 page", async function () {
    // arrange
    const templateName = "1 page";
    const templateFormat = Format.POSTCARD_SQ15;
    const templateLabels = ["label"];
    const templatePages = ["page1"];

    // act
    const promise = client.createTemplate({
      name: templateName,
      format: templateFormat,
      labels: templateLabels,
      pages: templatePages,
    });

    // assert
    await expect(promise).rejects.toThrow(/Invalid number of pages/);
  });

  it("should not create a template with 3 pages", async function () {
    // arrange
    const templateName = "3 pages";
    const templateFormat = Format.POSTCARD_SQ15;
    const templateLabels = ["label"];
    const templatePages = ["page1", "page2", "page3"];

    // act
    const promise = client.createTemplate({
      name: templateName,
      format: templateFormat,
      labels: templateLabels,
      pages: templatePages,
    });

    // assert
    await expect(promise).rejects.toThrow(/Invalid number of pages/);
  });

  it("should create a template without labels", async function () {
    // arrange
    const templateName = "no labels";
    const templateFormat = Format.POSTCARD_SQ15;
    const templatePages = ["page1", "page2"];

    // act
    const template = await client.createTemplate({
      name: templateName,
      format: templateFormat,
      pages: templatePages,
    });

    // assert
    expect(template.labels).toEqual([]);

    // teardown
    await template.delete();
  });
});

describe("getTemplates", function () {
  it("should return a paginated response", async function () {
    // arrange

    // act
    const templates = await client.getTemplates();

    // assert
    expect(templates).toBeDefined();
    expect(templates).toEqual(expect.any(PaginatedResponse));

    expect(templates.data).toBeDefined();
    expect(templates.data.length).toBeGreaterThanOrEqual(1);

    expect(templates.meta.total).toBeGreaterThanOrEqual(1);
    expect(templates.meta.page).toEqual(1);
    // Default page size is 10
    expect(templates.meta.pageSize).toBeGreaterThanOrEqual(10);
    expect(templates.meta.pages).toBeGreaterThanOrEqual(1);
  });

  it("should return a template", async function () {
    // arrange

    // act
    const templates = await client.getTemplates({ limit: 1 });
    const template = templates.data[0];

    // assert
    expect(template).toBeDefined();
    expect(template).toEqual(expect.any(Template));
  });

  it("should return a template with all fields", async function () {
    // arrange

    // act
    const templates = await client.getTemplates({ limit: 1 });
    const template = templates.data[0];

    // assert
    expect(template).toBeDefined();
    expect(template.id).toEqual(expect.any(String));
    expect(template.name).toEqual(expect.any(String));
    expect(template.format).toEqual(expect.any(String));
    expect(template.labels).toEqual(expect.any(Array));
    expect(template.mergeVariables).toEqual(expect.any(Array));
    expect(template.thumbnail).toEqual(expect.any(String));
    expect(template.updatedAt).toEqual(expect.any(Date));
    expect(template.version).toEqual(expect.any(Number));
  });

  it("should return not loaded templates", async function () {
    // arrange

    // act
    const templates = await client.getTemplates({ limit: 1 });
    const template = templates.data[0];

    // assert
    expect(template).toBeDefined();
    expect(template).toEqual(expect.any(Template));
    expect(() => template.pages).toThrow(/not loaded/);
  });

  it("should apply the name filter", async function () {
    // arrange
    const templateName = (await client.getTemplates()).data[1]?.name ?? "test";

    // act
    const templates = await client.getTemplates({
      limit: 1,
      filter: {
        name: templateName,
      },
    });

    const template = templates.data[0];

    // assert
    expect(template).toBeDefined();
    expect(template.name).toEqual(templateName);
  });

  it("should apply the labels filter", async function () {
    // arrange
    const templateLabels = (await client.getTemplates()).data.flatMap(
      (t) => t.labels,
    )[0];

    // act
    const templates = await client.getTemplates({
      limit: 1,
      filter: {
        labels: templateLabels,
      },
    });

    const template = templates.data[0];

    // assert
    expect(template).toBeDefined();
    expect(template.labels).toContain(templateLabels);
  });

  it("should apply the labels filter (some)", async function () {
    // arrange
    const templateLabels = (await client.getTemplates()).data.flatMap(
      (t) => t.labels,
    );

    // act
    const templates = await client.getTemplates({
      limit: 1,
      filter: {
        labels: {
          some: templateLabels,
        },
      },
    });

    const template = templates.data[0];

    // assert
    expect(template).toBeDefined();
    expect(template.labels).toContainEqual(expect.toBeOneOf(templateLabels));
  });

  it("should apply the labels filter (all)", async function () {
    // arrange
    const templateLabels = (await client.getTemplates()).data
      .map((t) => t.labels)
      .filter((l) => l.length > 0)[0];

    if (templateLabels === undefined) {
      console.warn("No templates with labels found, skipping test");
      return;
    }

    // act
    const templates = await client.getTemplates({
      limit: 1,
      filter: {
        labels: {
          all: templateLabels,
        },
      },
    });

    const template = templates.data[0];

    // assert
    expect(template).toBeDefined();
    expect(template.labels).toEqual(expect.toIncludeAllMembers(templateLabels));
  });

  it("should apply the format filter", async function () {
    // arrange

    // act
    const templates = await client.getTemplates({
      limit: 1,
      filter: {
        format: Format.POSTCARD_SQ15,
      },
    });

    const template = templates.data[0];

    // assert
    expect(template).toBeDefined();
    expect(template.format).toEqual(Format.POSTCARD_SQ15);
  });
});

describe("getTemplate", function () {
  let templateId: string = "";

  beforeAll(async function () {
    templateId = template.id;
  });

  it("should return a template", async function () {
    // arrange

    // act
    const loadedTemplate = await client.getTemplate(templateId);

    // assert
    expect(loadedTemplate).toBeDefined();
    expect(loadedTemplate).toEqual(expect.any(Template));
  });

  it("should return a template with all fields", async function () {
    // arrange

    // act
    const loadedTemplate = await client.getTemplate(templateId);

    // assert
    expect(loadedTemplate).toBeDefined();
    expect(loadedTemplate.id).toEqual(expect.any(String));
    expect(loadedTemplate.name).toEqual(expect.any(String));
    expect(loadedTemplate.format).toEqual(expect.any(String));
    expect(loadedTemplate.labels).toEqual(expect.any(Array));
    expect(loadedTemplate.mergeVariables).toEqual(expect.any(Array));
    expect(loadedTemplate.thumbnail).toEqual(expect.any(String));
    expect(loadedTemplate.updatedAt).toEqual(expect.any(Date));
    expect(loadedTemplate.version).toEqual(expect.any(Number));
  });

  it("should return a loaded template", async function () {
    // arrange

    // act
    const loadedTemplate = await client.getTemplate(templateId);

    // assert
    expect(loadedTemplate).toBeDefined();
    expect(loadedTemplate).toEqual(expect.any(Template));
    expect(loadedTemplate.pages).toEqual(expect.any(Array));
    expect(loadedTemplate.pages.length).toEqual(2);
    expect(loadedTemplate.pages[0]).toEqual(expect.any(String));
  });

  it("should throw an error when the template does not exist", async function () {
    // arrange

    // act
    const promise = client.getTemplate("test");

    // assert
    await expect(promise).rejects.toThrow(/not found/);
  });
});

describe("createOrder", function () {
  it("should create an order", async function () {
    // arrange

    // act
    const order = await client.createOrder({
      template: template,
      recipient: exampleAddress,
    });

    // assert
    expect(order).toBeDefined();
    expect(order).toEqual(expect.any(Order));
  });

  it("should create an order with all fields", async function () {
    // arrange
    const recipient = exampleAddress;

    // act
    const order = await client.createOrder({
      template: template,
      recipient: recipient,
    });

    // assert
    expect(order).toBeDefined();
    expect(order.id).toEqual(expect.any(String));
    expect(order.status).toEqual(expect.any(String));
    expect(order.createdAt).toEqual(expect.any(Date));
    expect(order.updatedAt).toEqual(expect.any(Date));
    // if sendDate is undefined, it should be today
    expect(order.sendDate.getDay()).toEqual(new Date().getDay());
    expect(order.friendlyStatus).toEqual(expect.any(String));
    expect(order.sender).toEqual(undefined);
    expect(order.recipient).toEqual(recipient);
    expect(order.templateId).toEqual(template.id);
    expect(order.mergeVariables).toEqual(expect.any(Object));
    expect(order.billingId).toEqual(undefined);
    expect(order.finish).toEqual(expect.any(String));
    expect(order.companyId).toEqual(expect.any(String));
    expect(order.isBillable).toEqual(expect.any(Boolean));
    expect(order.errors).toEqual(expect.any(Array));
    expect(order.definitiveCountryId).toEqual(expect.any(String));
  });

  it("should create an order with a send date", async function () {
    // arrange
    const sendDate = new Date();
    sendDate.setDate(sendDate.getDate() + 10);

    // act
    const order = await client.createOrder({
      template: template,
      recipient: exampleAddress,
      sendDate: sendDate,
    });

    // assert
    expect(order).toBeDefined();
    expect(order.sendDate.getDay()).toEqual(sendDate.getDay());
  });

  it("should create an order with a billing id", async function () {
    // arrange
    const billingId = "test";

    // act
    const order = await client.createOrder({
      template: template,
      recipient: exampleAddress,
      billingId: billingId,
    });

    // assert
    expect(order).toBeDefined();
    expect(order.billingId).toEqual(billingId);
  });

  it("should create an order with a finish", async function () {
    // arrange
    const finish = Finish.MATTE;

    // act
    const order = await client.createOrder({
      template: template,
      recipient: exampleAddress,
      finish: finish,
    });

    // assert
    expect(order).toBeDefined();
    expect(order.finish).toEqual(finish);
  });

  it("should create an order with a sender", async function () {
    // arrange
    const sender = exampleAddress;

    // act
    const order = await client.createOrder({
      template: template,
      recipient: exampleAddress,
      sender: sender,
    });

    // assert
    expect(order).toBeDefined();
    expect(order.sender).toEqual(sender);
  });

  it("should create an order with templateId", async function () {
    // arrange
    const templateId = template.id;

    // act
    const order = await client.createOrder({
      template: templateId,
      recipient: exampleAddress,
    });

    // assert
    expect(order).toBeDefined();
    expect(order.templateId).toEqual(templateId);
  });
});

describe("createCsvOrder", function () {
  let file: ArrayBuffer = null as unknown as ArrayBuffer;
  const mapping: CreateCsvOrder["mapping"] = {
    recipient: {
      name: "{{FirstName}} {{LastName}}",
      address: "{{Street}} {{HouseNr}}",
      postalCode: "{{ZIP}}",
      city: "{{City}}",
      country: "{{Country}}",
    },
  };

  beforeAll(() => {
    file = fs.readFileSync(path.join(__dirname, "assets/test.csv"));
  });

  it("should create a csv order", async function () {
    // arrange

    // act
    const csvOrder = await client.createCsvOrder({
      mapping: mapping,
      template: template,
      finish: Finish.GLOSSY,
      file: file,
    });

    // assert
    expect(csvOrder).toBeDefined();
    expect(csvOrder).toEqual(expect.any(CsvOrder));
  });

  it("should create a csv order with all fields", async function () {
    // arrange

    // act
    const csvOrder = await client.createCsvOrder({
      mapping: mapping,
      template: template,
      file: file,
    });

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
    expect(csvOrder.mergeVariableMapping).toEqual(mapping.mergeVariables);
    expect(csvOrder.billingId).toBeOneOf([undefined, expect.any(String)]);
    expect(csvOrder.finish).toEqual(expect.any(String));
    expect(csvOrder.format).toEqual(expect.any(String));
    expect(csvOrder.isBillable).toEqual(expect.any(Boolean));
    expect(csvOrder.estimatedOrderCount).toEqual(expect.any(Number));
    expect(csvOrder.failedOrderCount).toEqual(expect.any(Number));
    expect(csvOrder.processedOrderCount).toEqual(expect.any(Number));
    expect(csvOrder.totalOrderCount).toEqual(expect.any(Number));
  });

  it("should create a csv order with a billing id", async function () {
    // arrange
    const billingId = "test";

    // act
    const order = await client.createCsvOrder({
      mapping: mapping,
      template: template,
      file: file,
      billingId: billingId,
    });

    // assert
    expect(order).toBeDefined();
    expect(order.billingId).toEqual(billingId);
  });

  it("should create a csv order with a finish", async function () {
    // arrange
    const finish = Finish.MATTE;

    // act
    const order = await client.createCsvOrder({
      mapping: mapping,
      template: template,
      finish: finish,
      file: file,
    });

    // assert
    expect(order).toBeDefined();
    expect(order.finish).toEqual(finish);
  });

  it("should create a csv order with a sender", async function () {
    // arrange
    const sender = exampleAddress;

    // act
    const order = await client.createCsvOrder({
      mapping: mapping,
      template: template,
      finish: Finish.GLOSSY,
      file: file,
      sender: sender,
    });

    // assert
    expect(order).toBeDefined();
    expect(order.sender).toEqual(sender);
  });

  it("should create a csv order with templateId", async function () {
    // arrange
    const templateId = template.id;

    // act
    const order = await client.createCsvOrder({
      mapping: mapping,
      template: templateId,
      finish: Finish.GLOSSY,
      file: file,
    });

    // assert
    expect(order).toBeDefined();
    expect(order.templateId).toEqual(templateId);
  });
});

describe("getCsvOrder", function () {
  let csvOrderId: string = null as unknown as string;
  const mapping: CreateCsvOrder["mapping"] = {
    recipient: {
      city: "{{City}}",
      name: "{{FirstName}} {{LastName}}",
      address: "{{Street}} {{HouseNr}}",
      country: "{{Country}}",
      postalCode: "{{ZIP}}",
    },
  };

  beforeAll(async () => {
    const file = fs.readFileSync(path.join(__dirname, "assets/test.csv"));

    const csvOrder = await client.createCsvOrder({
      mapping: mapping,
      template: template,
      finish: Finish.GLOSSY,
      file: file,
    });

    csvOrderId = csvOrder.id;
  });

  it("should get a csv order with all fields", async function () {
    // arrange

    // act
    const csvOrder = await client.getCsvOrder(csvOrderId);

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
    expect(csvOrder.mergeVariableMapping).toEqual(mapping.mergeVariables);
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

describe("getOrder", function () {
  let orderId: string = null as unknown as string;

  // global arrange
  beforeAll(async function () {
    const orders = await client.getOrders({ limit: 1 });
    orderId = orders.data[0].id;
  });

  it("should return an order", async function () {
    // arrange

    // act
    const order = await client.getOrder(orderId);

    // assert
    expect(order).toBeDefined();
    expect(order).toEqual(expect.any(Order));
  });

  it("should return an order with all fields", async function () {
    // arrange

    // act
    const order = await client.getOrder(orderId);

    // assert
    expect(order).toBeDefined();
    expect(order.id).toEqual(expect.any(String));
    expect(order.status).toEqual(expect.any(String));
    expect(order.createdAt).toEqual(expect.any(Date));
    expect(order.updatedAt).toEqual(expect.any(Date));
    // if sendDate is undefined, it should be today
    expect(order.sendDate.getDay()).toEqual(new Date().getDay());
    expect(order.friendlyStatus).toEqual(expect.any(String));
    expect(order.sender).toEqual(
      expect.toBeOneOf([undefined, expect.any(Object)]),
    );
    expect(order.recipient).toEqual(expect.any(Object));
    expect(order.templateId).toEqual(expect.any(String));
    expect(order.mergeVariables).toEqual(expect.any(Object));
    expect(order.billingId).toEqual(
      expect.toBeOneOf([undefined, expect.any(String)]),
    );
    expect(order.finish).toEqual(expect.any(String));
    expect(order.companyId).toEqual(expect.any(String));
    expect(order.isBillable).toEqual(expect.any(Boolean));
    expect(order.errors).toEqual(expect.any(Array));
    expect(order.definitiveCountryId).toEqual(expect.any(String));
    expect(order.csvOrderId).toEqual(
      expect.toBeOneOf([expect.any(String), null]),
    );
    expect(order.batchId).toEqual(
      expect.toBeOneOf([expect.any(String), undefined]),
    );
  });

  it("should throw an error when the order does not exist", async function () {
    // arrange

    // act
    const promise = client.getOrder("test");

    // assert
    await expect(promise).rejects.toThrow(/not found/);
  });
});

describe("getOrders", function () {
  it("should return a paginated response", async function () {
    // arrange

    // act
    const orders = await client.getOrders();

    // assert
    expect(orders).toBeDefined();
    expect(orders).toEqual(expect.any(PaginatedResponse));

    expect(orders.data).toBeDefined();
    expect(orders.data.length).toBeGreaterThanOrEqual(1);

    expect(orders.meta.total).toBeGreaterThanOrEqual(1);
    expect(orders.meta.page).toEqual(1);
    // Default page size is 10
    expect(orders.meta.pageSize).toBeGreaterThanOrEqual(10);
    expect(orders.meta.pages).toBeGreaterThanOrEqual(1);
  });

  it("should return a order", async function () {
    // arrange

    // act
    const orders = await client.getOrders({ limit: 1 });
    const order = orders.data[0];

    // assert
    expect(order).toBeDefined();
    expect(order).toEqual(expect.any(Order));
  });

  it("should return a order with all fields", async function () {
    // arrange

    // act
    const orders = await client.getOrders({ limit: 1 });
    const order = orders.data[0];

    // assert
    expect(order).toBeDefined();
    expect(order.id).toEqual(expect.any(String));
    expect(order.status).toEqual(expect.any(String));
    expect(order.createdAt).toEqual(expect.any(Date));
    expect(order.updatedAt).toEqual(expect.any(Date));
    // if sendDate is undefined, it should be today
    expect(order.sendDate.getDay()).toEqual(new Date().getDay());
    expect(order.friendlyStatus).toEqual(expect.any(String));
    expect(order.sender).toEqual(
      expect.toBeOneOf([undefined, expect.any(Object)]),
    );
    expect(order.recipient).toEqual(expect.any(Object));
    expect(order.templateId).toEqual(expect.any(String));
    expect(order.mergeVariables).toEqual(expect.any(Object));
    expect(order.billingId).toEqual(
      expect.toBeOneOf([undefined, expect.any(String)]),
    );
    expect(order.finish).toEqual(expect.any(String));
    expect(order.companyId).toEqual(expect.any(String));
    expect(order.isBillable).toEqual(expect.any(Boolean));
    expect(order.errors).toEqual(expect.any(Array));
    expect(order.definitiveCountryId).toEqual(expect.any(String));
  });

  it("should apply the isBillable filter", async function () {
    // arrange

    // act
    const orders = await client.getOrders({
      limit: 1,
      filter: {
        isBillable: true,
      },
    });
    const order = orders.data[0];

    if (order === undefined) {
      console.warn("No orders found, skipping test");
      return;
    }

    // assert
    expect(order).toBeDefined();
    expect(order.isBillable).toEqual(true);
  });

  it("should apply the friendlyStatus filter", async function () {
    // arrange

    // act
    const orders = await client.getOrders({
      limit: 1,
      filter: {
        friendlyStatus: FriendlyStatus.Sent,
      },
    });
    const order = orders.data[0];

    if (order === undefined) {
      console.warn("No orders found, skipping test");
      return;
    }

    // assert
    expect(order).toBeDefined();
    expect(order.friendlyStatus).toEqual(FriendlyStatus.Sent);
  });

  it("should apply the billingId filter", async function () {
    // arrange

    // act
    const orders = await client.getOrders({
      limit: 1,
      filter: {
        billingId: "test",
      },
    });
    const order = orders.data[0];

    if (order === undefined) {
      console.warn("No orders found, skipping test");
      return;
    }

    // assert
    expect(order).toBeDefined();
    expect(order.billingId).toEqual("test");
  });

  it("should apply the format filter", async function () {
    // arrange

    // act
    const orders = await client.getOrders({
      limit: 1,
      filter: {
        format: Format.GREETINGCARD_SQ14,
      },
    });
    const order = orders.data[0];

    if (order === undefined) {
      console.warn("No orders found, skipping test");
      return;
    }

    // assert
    expect(order).toBeDefined();
    expect(order.format).toEqual(Format.GREETINGCARD_SQ14);
  });

  it("should apply the format filter (multiple)", async function () {
    // arrange

    // act
    const orders = await client.getOrders({
      limit: 1,
      filter: {
        format: [Format.GREETINGCARD_SQ14, Format.POSTCARD_SQ15],
      },
    });
    const order = orders.data[0];

    // assert
    expect(order).toBeDefined();
    expect(order.format).toEqual(
      expect.toBeOneOf([Format.GREETINGCARD_SQ14, Format.POSTCARD_SQ15]),
    );
  });

  it("should apply the createdAt filter", async function () {
    // arrange
    const from = new Date();
    from.setDate(from.getDay() - 31);
    const to = new Date();
    to.setDate(to.getDay() - 10);

    // act
    const orders = await client.getOrders({
      limit: 1,
      filter: {
        createdAt: {
          from,
          to,
        },
      },
    });
    const order = orders.data[0];

    if (order === undefined) {
      console.warn("No orders found, skipping test");
      return;
    }

    // assert
    expect(order).toBeDefined();
    expect(order.createdAt).toBeBetween(from, to);
  });

  it("should apply the createdAt filter (only from)", async function () {
    // arrange
    const from = new Date();
    from.setDate(from.getDay() - 31);

    // act
    const orders = await client.getOrders({
      limit: 1,
      filter: {
        createdAt: {
          from,
        },
      },
    });
    const order = orders.data[0];

    if (order === undefined) {
      console.warn("No orders found, skipping test");
      return;
    }

    // assert
    expect(order).toBeDefined();
    expect(order.createdAt).toBeBetween(from, new Date());
  });

  it("should apply the createdAt filter (only to)", async function () {
    // arrange
    const to = new Date();
    to.setDate(to.getDay() - 10);

    // act
    const orders = await client.getOrders({
      limit: 1,
      filter: {
        createdAt: {
          to,
        },
      },
    });
    const order = orders.data[0];

    // assert
    expect(order).toBeDefined();
    expect(order.createdAt).toBeBetween(new Date(0), to);
  });

  it("should apply the anonymizedAt filter (true)", async function () {
    // arrange

    // act
    const orders = await client.getOrders({
      limit: 1,
      filter: {
        anonymizedAt: true,
      },
    });
    const order = orders.data[0];

    if (order === undefined) {
      console.warn("No orders found, skipping test");
      return;
    }

    // assert
    expect(order).toBeDefined();
    expect(order.anonymizedAt).toEqual(expect.any(Date));
  });

  it("should apply the anonymizedAt filter (false)", async function () {
    // arrange

    // act
    const orders = await client.getOrders({
      limit: 1,
      filter: {
        anonymizedAt: false,
      },
    });
    const order = orders.data[0];

    if (order === undefined) {
      console.warn("No orders found, skipping test");
      return;
    }

    // assert
    expect(order).toBeDefined();
    expect(order.anonymizedAt).toEqual(undefined);
  });

  it("should apply the anonymizedAt filter", async function () {
    // arrange
    const from = new Date();
    from.setDate(1);
    from.setMonth(from.getMonth() - 9);
    const to = new Date();
    to.setDate(31);
    to.setMonth(from.getMonth() - 9);

    // act
    const orders = await client.getOrders({
      limit: 1,
      filter: {
        anonymizedAt: {
          from,
          to,
        },
      },
    });
    const order = orders.data[0];

    if (order === undefined) {
      console.warn("No orders found, skipping test");
      return;
    }

    // assert
    expect(order).toBeDefined();
    expect(order.anonymizedAt).toBeBetween(from, to);
  });

  it("should apply the batchId filter (null)", async function () {
    // arrange

    // act
    const orders = await client.getOrders({
      limit: 1,
      filter: {
        batchId: null,
      },
    });
    const order = orders.data[0];

    // assert
    expect(order).toBeDefined();
  });

  it("should apply the batchId filter (batchId)", async function () {
    // arrange
    const batch = await client.createBatch({
      name: "Test batch",
      finish: Finish.GLOSSY,
      template: template,
    });
    const batchOrder = await batch.createOrder({
      recipient: exampleAddress,
    });

    // act
    const orders = await client.getOrders({
      limit: 1,
      filter: {
        batchId: batch.id,
      },
    });
    const order = orders.data[0];

    // assert
    expect(order).toBeDefined();
    expect(order.id).toEqual(batchOrder.id);
  });

  describe("sortby", function () {
    it("should sort by createdAt", async function () {
      // arrange

      // act
      const orders = await client.getOrders({
        limit: 2,
        sortBy: "createdAt:ASC",
      });
      const order = orders.data[0];
      const order2 = orders.data[1];

      // assert
      expect(order).toBeDefined();
      expect(order.createdAt).toEqual(expect.any(Date));
      expect(order2).toBeDefined();
      expect(order2.createdAt).toEqual(expect.any(Date));

      expect(order.createdAt.getTime()).toBeLessThan(
        order2.createdAt.getTime(),
      );
    });

    it("should sort by createdAt (DESC)", async function () {
      // arrange

      // act
      const orders = await client.getOrders({
        limit: 2,
        sortBy: {
          field: "createdAt",
          order: "DESC",
        },
      });
      const order = orders.data[0];
      const order2 = orders.data[1];

      // assert
      expect(order).toBeDefined();
      expect(order.createdAt).toEqual(expect.any(Date));
      expect(order2).toBeDefined();
      expect(order2.createdAt).toEqual(expect.any(Date));

      expect(order.createdAt.getTime()).toBeGreaterThanOrEqual(
        order2.createdAt.getTime(),
      );
    });

    it("should sort by multiple", async function () {
      // arrange

      // act
      const orders = await client.getOrders({
        limit: 2,
        sortBy: ["friendlyStatus:ASC", "createdAt:ASC"],
      });
      const order = orders.data[0];
      const order2 = orders.data[1];

      // assert
      expect(order).toBeDefined();
      expect(order.createdAt).toEqual(expect.any(Date));
      expect(order2).toBeDefined();
      expect(order2.createdAt).toEqual(expect.any(Date));

      if (order.friendlyStatus === order2.friendlyStatus) {
        expect(order.createdAt.getTime()).toBeGreaterThanOrEqual(
          order2.createdAt.getTime(),
        );
      } else {
        expect(order.friendlyStatus).not.toEqual(order2.friendlyStatus);
      }
    });
  });
});

describe("createBatch", function () {
  it("should create an batch", async function () {
    // arrange

    // act
    const batch = await client.createBatch({
      name: "Test batch",
      finish: Finish.GLOSSY,
      template: template,
    });

    // assert
    expect(batch).toBeDefined();
    expect(batch).toEqual(expect.any(Batch));
  });

  it("should create an batch with all fields", async function () {
    // arrange

    // act
    const batch = await client.createBatch({
      name: "Test batch",
      finish: Finish.GLOSSY,
      template: template,
    });

    // assert
    expect(batch).toBeDefined();
    expect(batch.id).toEqual(expect.any(String));
    expect(batch.companyId).toEqual(expect.any(String));
    expect(batch.name).toEqual("Test batch");
    expect(batch.status).toEqual(BatchStatus.batch_created);
    expect(batch.createdAt).toEqual(expect.any(Date));
    expect(batch.updatedAt).toEqual(expect.any(Date));
    expect(batch.finish).toEqual(Finish.GLOSSY);
    expect(batch.templateId).toEqual(template.id);
    expect(batch.isBillable).toEqual(expect.any(Boolean));
    expect(batch.estimatedPrice).toEqual(0);
    expect(batch.sendDate).toEqual(
      expect.toBeOneOf([undefined, expect.any(Date)]),
    );
    expect(batch.orders).toStrictEqual({
      processing: 0,
      success: 0,
      failed: 0,
      cancelled: 0,
    });
  });

  it("should create an batch with a ready date", async function () {
    // arrange
    const sendDate = new Date();
    sendDate.setDate(sendDate.getDate() + 10);

    // act
    const batch = await client.createBatch({
      name: "Test batch",
      finish: Finish.GLOSSY,
      template: template,
      ready: sendDate,
    });

    // assert
    expect(batch).toBeDefined();
    expect(batch.sendDate?.getDay()).toEqual(sendDate.getDay());
  });

  it("should create an batch that is ready", async function () {
    // arrange
    const sendDate = new Date();
    sendDate.setDate(sendDate.getDate() + 10);

    // act
    const batch = await client.createBatch({
      name: "Test batch",
      finish: Finish.GLOSSY,
      template: template,
      ready: true,
    });

    // assert
    expect(batch).toBeDefined();
    expect(batch.status).toEqual(BatchStatus.batch_user_ready);
    expect(batch.sendDate).toBeBefore(new Date());
  });

  it("should create an batch with a billing id", async function () {
    // arrange
    const billingId = "test";

    // act
    const batch = await client.createBatch({
      name: "Test batch",
      finish: Finish.GLOSSY,
      template: template,
      billingId: billingId,
    });

    // assert
    expect(batch).toBeDefined();
    expect(batch.billingId).toEqual(billingId);
  });

  it("should create an batch with templateId", async function () {
    // arrange
    const templateId = template.id;

    // act
    const batch = await client.createBatch({
      name: "Test batch",
      finish: Finish.GLOSSY,
      template: templateId,
    });

    // assert
    expect(batch).toBeDefined();
    expect(batch.templateId).toEqual(templateId);
  });
});

describe("getBatch", function () {
  let batchId: string = null as unknown as string;

  // global arrange
  beforeAll(async function () {
    const batch = await client.createBatch({
      name: "Test batch",
      template: template,
      finish: Finish.GLOSSY,
    });
    batchId = batch.id;
  });

  it("should return an batch", async function () {
    // arrange

    // act
    const batch = await client.getBatch(batchId);

    // assert
    expect(batch).toBeDefined();
    expect(batch).toEqual(expect.any(Batch));
  });

  it("should return an batch with all fields", async function () {
    // arrange

    // act
    const batch = await client.getBatch(batchId);

    // assert
    expect(batch).toBeDefined();
    expect(batch.id).toEqual(expect.any(String));
    expect(batch.companyId).toEqual(expect.any(String));
    expect(batch.name).toEqual(expect.any(String));
    expect(batch.status).toEqual(expect.any(String));
    expect(batch.createdAt).toEqual(expect.any(Date));
    expect(batch.updatedAt).toEqual(expect.any(Date));
    expect(batch.finish).toEqual(expect.any(String));
    expect(batch.templateId).toEqual(expect.any(String));
    expect(batch.isBillable).toEqual(expect.any(Boolean));
    expect(batch.estimatedPrice).toEqual(expect.any(Number));
    expect(batch.sendDate).toEqual(
      expect.toBeOneOf([undefined, expect.any(Date)]),
    );
    expect(batch.orders).toEqual(expect.any(Object));
  });

  it("should throw an error when the batch does not exist", async function () {
    // arrange

    // act
    const promise = client.getBatch("test");

    // assert
    await expect(promise).rejects.toThrow(/not found/);
  });
});

describe("getBatches", function () {
  it("should return a paginated response", async function () {
    // arrange

    // act
    const batches = await client.getBatches();

    // assert
    expect(batches).toBeDefined();
    expect(batches).toEqual(expect.any(PaginatedResponse));

    expect(batches.data).toBeDefined();
    expect(batches.data.length).toBeGreaterThanOrEqual(1);

    expect(batches.meta.total).toBeGreaterThanOrEqual(1);
    expect(batches.meta.page).toEqual(1);
    // Default page size is 10
    expect(batches.meta.pageSize).toBeGreaterThanOrEqual(10);
    expect(batches.meta.pages).toBeGreaterThanOrEqual(1);
  });

  it("should return a batch", async function () {
    // arrange

    // act
    const batches = await client.getBatches({ limit: 1 });
    const batch = batches.data[0];

    // assert
    expect(batch).toBeDefined();
    expect(batch).toEqual(expect.any(Batch));
  });

  it("should return a batch with all fields", async function () {
    // arrange

    // act
    const batches = await client.getBatches({ limit: 1 });
    const batch = batches.data[0];

    // assert
    expect(batch).toBeDefined();
    expect(batch.id).toEqual(expect.any(String));
    expect(batch.companyId).toEqual(expect.any(String));
    expect(batch.name).toEqual(expect.any(String));
    expect(batch.status).toEqual(expect.any(String));
    expect(batch.createdAt).toEqual(expect.any(Date));
    expect(batch.updatedAt).toEqual(expect.any(Date));
    expect(batch.finish).toEqual(expect.any(String));
    expect(batch.templateId).toEqual(expect.any(String));
    expect(batch.isBillable).toEqual(expect.any(Boolean));
    expect(batch.estimatedPrice).toEqual(expect.any(Number));
    expect(batch.sendDate).toEqual(
      expect.toBeOneOf([undefined, expect.any(Date)]),
    );
    expect(batch.orders).toEqual(expect.any(Object));
  });

  it("should apply the billingId filter", async function () {
    // arrange

    // act
    const batches = await client.getBatches({
      limit: 1,
      filter: {
        billingId: "test",
      },
    });
    const batch = batches.data[0];

    if (batch === undefined) {
      console.warn("No batches found, skipping test");
      return;
    }

    // assert
    expect(batch).toBeDefined();
    expect(batch.billingId).toEqual("test");
  });

  it("should apply the name filter", async function () {
    // arrange
    const batchName = (await client.getBatches()).data[1]?.name ?? "test";

    // act
    const batches = await client.getBatches({
      limit: 1,
      filter: {
        name: batchName,
      },
    });
    const batch = batches.data[0];

    // assert
    expect(batch).toBeDefined();
    expect(batch.name).toEqual(batchName);
  });

  it("should apply the createdAt filter", async function () {
    // arrange
    const from = new Date();
    from.setDate(from.getDay() - 31);
    const to = new Date();
    to.setDate(to.getDay() - 10);

    // act
    const batches = await client.getBatches({
      limit: 1,
      filter: {
        createdAt: {
          from,
          to,
        },
      },
    });
    const batch = batches.data[0];

    if (batch === undefined) {
      console.warn("No batches found, skipping test");
      return;
    }

    // assert
    expect(batch).toBeDefined();
    expect(batch.createdAt).toBeBetween(from, to);
  });

  it("should apply the updatedAt filter", async function () {
    // arrange
    const from = new Date();
    from.setDate(from.getDay() - 31);
    const to = new Date();
    to.setDate(to.getDay() - 10);

    // act
    const batches = await client.getBatches({
      limit: 1,
      filter: {
        updatedAt: {
          from,
          to,
        },
      },
    });
    const batch = batches.data[0];

    if (batch === undefined) {
      console.warn("No batches found, skipping test");
      return;
    }

    // assert
    expect(batch).toBeDefined();
    expect(batch.updatedAt).toBeBetween(from, to);
  });

  it("should apply the sendDate filter (true)", async function () {
    // arrange

    // act
    const batches = await client.getBatches({
      limit: 1,
      filter: {
        sendDate: true,
      },
    });
    const batch = batches.data[0];

    if (batch === undefined) {
      console.warn("No batches found, skipping test");
      return;
    }

    // assert
    expect(batch).toBeDefined();
    expect(batch.sendDate).toEqual(expect.any(Date));
  });

  it("should apply the sendDate filter (false)", async function () {
    // arrange

    // act
    const batches = await client.getBatches({
      limit: 1,
      filter: {
        sendDate: false,
      },
    });
    const batch = batches.data[0];

    if (batch === undefined) {
      console.warn("No batches found, skipping test");
      return;
    }

    // assert
    expect(batch).toBeDefined();
    expect(batch.sendDate).toEqual(undefined);
  });

  it("should apply the sendDate filter", async function () {
    // arrange
    const from = new Date();
    from.setDate(1);
    from.setMonth(from.getMonth() - 9);
    const to = new Date();
    to.setDate(31);
    to.setMonth(from.getMonth() - 9);

    // act
    const batches = await client.getBatches({
      limit: 1,
      filter: {
        sendDate: {
          from,
          to,
        },
      },
    });
    const batch = batches.data[0];

    if (batch === undefined) {
      console.warn("No batches found, skipping test");
      return;
    }

    // assert
    expect(batch).toBeDefined();
    expect(batch.sendDate).toBeBetween(from, to);
  });

  it("should apply the finish filter", async function () {
    // arrange

    // act
    const batches = await client.getBatches({
      limit: 1,
      filter: {
        finish: Finish.GLOSSY,
      },
    });
    const batch = batches.data[0];

    if (batch === undefined) {
      console.warn("No batches found, skipping test");
      return;
    }

    // assert
    expect(batch).toBeDefined();
    expect(batch.finish).toEqual(Finish.GLOSSY);
  });

  it("should apply the templates filter (Template)", async function () {
    // arrange

    // act
    const batches = await client.getBatches({
      limit: 1,
      filter: {
        templates: template.id,
      },
    });
    const batch = batches.data[0];

    if (batch === undefined) {
      console.warn("No batches found, skipping test");
      return;
    }

    // assert
    expect(batch).toBeDefined();
    expect(batch.templateId).toEqual(template.id);
  });

  it("should apply the templates filter (templateId)", async function () {
    // arrange

    // act
    const batches = await client.getBatches({
      limit: 1,
      filter: {
        templates: template,
      },
    });
    const batch = batches.data[0];

    if (batch === undefined) {
      console.warn("No batches found, skipping test");
      return;
    }

    // assert
    expect(batch).toBeDefined();
    expect(batch.templateId).toEqual(template.id);
  });
});
