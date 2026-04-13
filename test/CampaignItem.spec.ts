import { Campaign } from "~/index";
import { CampaignItem } from "~/models/CampaignItem";
import { client } from "./client";
import { contCampaignId } from "./utils";
import { sleep } from "~/utils";

let campaign: Campaign = null as unknown as Campaign;
let item: CampaignItem = null as unknown as CampaignItem;

beforeAll(async function () {
  campaign = await client.getCampaign(contCampaignId);
});

beforeEach(async function () {
  item = await campaign.addItem({
    recipient: {
      name: `John Doe ${Math.random().toString(36)}`,
      address: "Houtmarkt 1",
      postalCode: "2011 AL",
      city: "Haarlem",
      country: "Nederland",
    },
    sendDate: new Date(),
    draft: true,
  });
});

describe("refresh", function () {
  it("should refresh the item", async function () {
    // precondition
    expect(item.status).toEqual("order_created");

    // arrange

    // act
    while (item.status === "order_created") {
      await item.refresh();
      await sleep(1000);
    }

    // assert
    expect(item.status).not.toEqual("order_created");
  }, 30000);
});

describe("download", function () {
  it("should download the preview", async function () {
    // arrange

    // act
    const buffer = await item.download();

    // assert
    expect(buffer).toBeInstanceOf(Uint8Array);
    expect(buffer.byteLength).toBeGreaterThan(0);
  }, 30000);

  it("should throw an error when no polling", async function () {
    // arrange

    // act
    const download = item.download(false);

    // assert
    await expect(download).rejects.toThrow();
  }, 10000);
});

describe("cancel", function () {
  it("should cancel the item", async function () {
    // arrange

    // act
    await item.cancel();

    // assert
    expect(item.status).toEqual("order_cancelled");
  }, 30000);
});

describe("markDeliverable", function () {
  it("should mark the item as deliverable", async function () {
    // arrange
    expect(item.draft).toBeTrue();

    // act
    await item.markDeliverable();

    // assert
    expect(item.draft).toBeFalse();
  });
});

describe("edit", function () {
  it("should edit the item", async function () {
    // act
    await item.edit({
      recipient: {
        ...item.recipient,
        name: "Edited Joe",
      },
    });

    // assert
    expect(item.recipient.name).toEqual("Edited Joe");
    const item2 = await campaign.getItem(item.id);
    expect(item2.recipient.name).toEqual("Edited Joe");
  });
});
