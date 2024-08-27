import { client } from "./client";
import { Webhook } from "~/models/Webhook";
import { PaginatedResponse } from "~/models/PaginatedResponse";
import { WebhookLog } from "~/models/WebhookLog";
import { sleep } from "~/utils";
import { OrderStatusUpdateWebhookRequest } from "~/models/WebhookRequest";
import { Template } from "~/models/Template";
import { Format } from "~/enums/Format";

let webhook: Webhook = null as unknown as Webhook;
let template: Template = null as unknown as Template;

beforeEach(async function () {
  webhook = await client.createWebhook({
    name: `Test Webhook ${new Date().toISOString().replaceAll(":", "-")}`,
    url: "https://example.com",
    events: ["order_status_update"],
    active: false,
  });

  template = await client.createTemplate({
    name: `Test Order ${new Date().toISOString().replaceAll(":", "-")}`,
    format: Format.POSTCARD_SQ15,
    labels: ["library-unit-test"],
    pages: ["page1", "page2"],
  });
});

afterEach(async function () {
  await webhook?.delete().catch(() => null);
  await template?.delete().catch(() => null);
});

describe("fields", function () {
  it("should have all fields", async function () {
    // arrange

    // act

    // assert
    expect(webhook.id).toEqual(expect.any(String));
    expect(webhook.name).toEqual(expect.any(String));
    expect(webhook.url).toEqual(expect.any(String));
    expect(webhook.events).toEqual(expect.any(Array));
    expect(webhook.active).toEqual(expect.any(Boolean));
    expect(webhook.headers).toEqual(expect.any(Object));
    expect(webhook.secretHeaders).toEqual(expect.any(Object));
    expect(webhook.successRate).toEqual(
      expect.toBeOneOf([null, expect.any(Number)]),
    );
  });
});

describe("update()", function () {
  it("should update the webhook", async function () {
    // arrange

    // act
    await webhook.update({ active: true });

    // assert
    expect(webhook.active).toBe(true);
  });

  it("should update the webhook with secret headers", async function () {
    // arrange

    // act
    await webhook.update({ secretHeaders: { Authorization: "Bearer 123" } });

    // assert
    expect(webhook.secretHeaders).toEqual({
      Authorization: expect.not.stringMatching("Bearer 123"),
    });
  });
});

describe("getLogs()", function () {
  it("should return no logs", async function () {
    // arrange

    // act
    const logs = await webhook.getLogs();

    // assert
    expect(logs).toBeInstanceOf(PaginatedResponse);
    expect(logs.data).toHaveLength(0);
    expect(logs.meta.total).toBe(0);
  });

  it("should return logs", async function () {
    // arrange
    await webhook.update({ active: true });

    await client.createOrder({
      template: template,
      recipient: {
        name: "John Doe",
        address: "123 Main St",
        city: "Springfield",
        country: "USA",
        postalCode: "12345",
      },
    });

    await sleep(5000);

    // act
    const logs = await webhook.getLogs();

    // assert
    expect(logs).toBeInstanceOf(PaginatedResponse);
    expect(logs.meta.total).toBeGreaterThanOrEqual(1);
    expect(logs.data[0]).toBeInstanceOf(WebhookLog);

    const log = logs.data[0]!;
    expect(log.id).toEqual(expect.any(String));
    expect(log.event).toEqual(expect.any(String));
    expect(log.status).toEqual(expect.toBeOneOf(["success", "failed"]));
    expect(log.response).toEqual(expect.any(Object));
    expect(log.request).toBeInstanceOf(OrderStatusUpdateWebhookRequest);
    expect(log.createdAt).toBeInstanceOf(Date);
  }, 10000);
});

describe("delete()", function () {
  it("should delete the webhook", async function () {
    // arrange

    // act
    await webhook.delete();

    // assert
    await expect(client.getWebhook(webhook.id)).rejects.toThrow();
  });
});
