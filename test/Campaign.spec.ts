import {
  Address,
  Campaign,
  CampaignItem,
  CampaignScheduleType,
  CampaignStatus,
  ContinuousDestination,
  Destination,
  OneOffDestination,
} from "~/index";
import { client } from "./client";
import { addDesignData, contCampaignId, oneOffCampaignId } from "./utils";
import { PaginatedResponseV3 } from "~/models/Response.v3";
import * as fs from "fs";
import * as path from "path";
import { CampaignImport, CreateCampaignImport } from "~/models/CampaignImport";

describe("Campaign Model", function () {
  it("should have all properties defined continuous", async function () {
    // arrange
    const campaign = await client.getCampaign(contCampaignId);

    // assert
    expect(campaign.id).toEqual(expect.any(String));
    expect(campaign.identifier).toEqual(expect.any(String));
    expect(campaign.name).toEqual(expect.any(String));
    expect(campaign.description).toBeNull();
    expect(campaign.meta).toBeInstanceOf(Object);
    expect(campaign.mergeVariables).toBeInstanceOf(Array);
    expect(campaign.scheduleType).toBe(CampaignScheduleType.CONTINUOUS);
    expect(campaign.stampId).toBeNull();
    expect(campaign.sender).toEqual(
      expect.toBeOneOf([null, expect.any(Object)]),
    );
    expect(campaign.billingId).toBeNull();
    expect(campaign.npdrCategory).toBeUndefined();
    expect(campaign.status).toBe(CampaignStatus.RUNNING);
    expect(campaign.createdAt).toBeInstanceOf(Date);
    expect(campaign.updatedAt).toBeInstanceOf(Date);
    expect(campaign.destinations).toBeInstanceOf(Array);
    expect(campaign.destinations.length).toBe(2);
    expect(campaign.destinations[0]).toBeInstanceOf(ContinuousDestination);
  });

  it("should have all properties defined one-off", async function () {
    // arrange
    const campaign = await client.getCampaign(oneOffCampaignId);

    // assert
    expect(campaign.id).toEqual(expect.any(String));
    expect(campaign.identifier).toEqual(expect.any(String));
    expect(campaign.name).toEqual(expect.any(String));
    expect(campaign.description).toBeNull();
    expect(campaign.meta).toBeInstanceOf(Object);
    expect(campaign.mergeVariables).toBeInstanceOf(Array);
    expect(campaign.scheduleType).toBe(CampaignScheduleType.ONE_OFF);
    expect(campaign.stampId).toBeNull();
    expect(campaign.sender).toEqual(
      expect.toBeOneOf([null, expect.any(Object)]),
    );
    expect(campaign.billingId).toBeNull();
    expect(campaign.status).toBe(CampaignStatus.RUNNING);
    expect(campaign.createdAt).toBeInstanceOf(Date);
    expect(campaign.updatedAt).toBeInstanceOf(Date);
    expect(campaign.destinations).toBeInstanceOf(Array);
    expect(campaign.destinations.length).toBe(2);
    expect(campaign.destinations[0]).toBeInstanceOf(OneOffDestination);
  });

  it("should load campaign Designs", async function () {
    // arrange
    const campaign = await client.getCampaign(contCampaignId);

    const campaignId = campaign.id;
    const destination = campaign.destinations[0].destination;
    const defaultPageSize = 20;

    const initialDesigns = await client.getCampaignDesigns(campaignId, {
      limit: 1,
    });
    let totalItems = initialDesigns.meta.totalItems;

    expect(campaign.designs.length).toBe(0);

    const designIds: string[] = [];
    while (totalItems++ <= defaultPageSize) {
      const design = await client.addDesignToDestination(
        campaignId,
        destination,
        addDesignData,
      );
      designIds.push(design.id);
    }

    // act
    await campaign.loadDesigns();

    // assert
    expect(campaign.designs.length).toBeGreaterThanOrEqual(designIds.length);
    expect(campaign.designs[0].campaignId).toBe(campaign.id);
    // any design with the correct id
    expect(campaign.designs.map((d) => d.id)).toEqual(
      expect.arrayContaining(designIds),
    );

    // cleanup
    try {
      for (const designId of designIds) {
        await client.deleteDesignFromDestination(
          campaignId,
          destination,
          designId,
        );
      }
    } catch {
      // ignore cleanup errors
    }
  }, 20000);

  it("should pause a campaign", async function () {
    // arrange
    const campaign = await client.getCampaign(contCampaignId);
    if (campaign.status !== CampaignStatus.RUNNING) await campaign.resume();

    // act
    await campaign.pause();

    // assert
    expect(campaign.status).toBe(CampaignStatus.PAUSED);

    await campaign.resume(); // cleanup
  });

  it("should resume a campaign", async function () {
    // arrange
    const campaign = await client.getCampaign(contCampaignId);
    if (campaign.status !== CampaignStatus.PAUSED) await campaign.pause();

    // act
    await campaign.resume();

    // assert
    expect(campaign.status).toBe(CampaignStatus.RUNNING);
  });

  it("should add fallback variables", async function () {
    // arrange
    const campaign = await client.getCampaign(contCampaignId);
    // ensure no fallbacks exist
    await campaign.addVariablesFallback({
      [Destination.NETHERLANDS]: null,
      [Destination.GERMANY]: null,
      [Destination.INTERNATIONAL]: null,
    });
    expect(
      campaign.destinations.flatMap((d) =>
        Object.keys(d.variablesFallback ?? {}),
      ),
    ).toHaveLength(0);

    const design = await client.addDesignToDestination(
      campaign.id,
      Destination.NETHERLANDS,
      {
        ...addDesignData,
        pages: [
          { content: "Hello {{firstName}}" },
          { content: "Goodbye {{lastName}}" },
        ],
      },
    );
    expect(design.mergeVariables).toEqual(
      expect.arrayContaining(["firstName", "lastName"]),
    );

    // act
    await campaign.addVariablesFallback({
      [Destination.NETHERLANDS]: {
        firstName: "John",
        lastName: "Doe",
      },
    });

    // assert
    const destination = campaign.destinations.find(
      (d) => d.destination === Destination.NETHERLANDS,
    );
    expect(destination).toBeDefined();
    expect(destination?.variablesFallback).toEqual({
      firstName: "John",
      lastName: "Doe",
    });

    // tear down
    await client.deleteDesignFromDestination(
      design.campaignId,
      design.destination,
      design.id,
    );
    await campaign.addVariablesFallback({
      [Destination.NETHERLANDS]: null,
      [Destination.GERMANY]: null,
      [Destination.INTERNATIONAL]: null,
    });
  }, 10000);

  it("should refresh a campaign", async function () {
    // arrange
    const campaign = await client.getCampaign(contCampaignId);
    const spy = jest.spyOn(campaign["_protected"].clientV3, "GET");

    // act
    await campaign.refresh();

    // assert
    expect(spy).toHaveBeenCalled();
  });

  it("should refresh a campaign with designs", async function () {
    // arrange
    const campaign = await client.getCampaign(contCampaignId);
    await campaign.loadDesigns();

    const spy = jest.spyOn(campaign["_protected"].clientV3, "GET");
    const spyLoadDesigns = jest.spyOn(campaign, "loadDesigns");

    // act
    await campaign.refresh();

    // assert
    expect(spy).toHaveBeenCalled();
    expect(spyLoadDesigns).toHaveBeenCalled();
  }, 10000);
});

let campaign: Campaign = null as unknown as Campaign;

beforeAll(async function () {
  campaign = await client.getCampaign(contCampaignId);
});

describe("addItem", function () {
  const exampleAddress: Address = {
    name: "Test",
    addressLine2: undefined,
    address: "Houtmarkt 1",
    postalCode: "2011 AL",
    city: "Haarlem",
    country: "Netherlands",
  };

  it("should create a draft item", async function () {
    // arrange

    // act
    const item = await campaign.addItem({
      recipient: exampleAddress,
      draft: true,
    });

    // assert
    expect(item).toBeDefined();
    expect(item).toBeInstanceOf(CampaignItem);
    expect(item.draft).toBeTrue();
  });

  it("should create a non-draft item", async function () {
    // arrange

    // act
    const item = await campaign.addItem({
      recipient: exampleAddress,
      draft: false,
    });

    // assert
    expect(item).toBeDefined();
    expect(item).toBeInstanceOf(CampaignItem);
    expect(item.draft).toBeFalse();
  });

  it("should create an item with all fields", async function () {
    // act
    const item = await campaign.addItem({
      recipient: exampleAddress,
      mergeVariables: {
        var1: "value1",
        var2: "value2",
      },
      sendDate: new Date(),
      draft: false,
    });

    // assert
    expect(item).toBeDefined();
    expect(item.id).toEqual(expect.any(String));
    expect(item.campaignId).toEqual(campaign.id);
    expect(item.companyId).toEqual(expect.any(String));
    expect(item.templateId).toEqual(expect.any(String));
    expect(item.templateVersion).toEqual(expect.any(Number));
    expect(item.finish).toEqual(expect.any(String));
    expect(item.format).toEqual(expect.any(String));
    expect(item.mergeVariables).toEqual({
      var1: "value1",
      var2: "value2",
    });
    expect(item.sender).toBeInstanceOf(Object);
    expect(item.recipient).toEqual(exampleAddress);
    expect(item.definitiveCountryId).toEqual(expect.any(String));
    expect(item.region).toEqual(expect.any(String));
    expect(item.draft).toBeFalse();
    expect(item.destination).toEqual(expect.any(String));
    expect(item.status).toEqual(expect.any(String));
    expect(item.friendlyStatus).toEqual(expect.any(String));
    expect(item.errors).toBeInstanceOf(Array);
    expect(item.warnings).toBeInstanceOf(Array);
    expect(item.metadata).toBeInstanceOf(Object);
    expect(item.sendDate).toBeInstanceOf(Date);
    expect(item.createdAt).toBeInstanceOf(Date);
    expect(item.updatedAt).toBeInstanceOf(Date);
    expect(item.anonymizedAt).toEqual(
      expect.toBeOneOf([null, expect.any(Date)]),
    );
    expect(item.importId).toEqual(expect.toBeOneOf([null, expect.any(String)]));
  });
});

describe("getItems", function () {
  it("should return the items", async function () {
    // act
    const result = await campaign.getItems({
      filter: {
        draft: true,
      },
    });

    // assert
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(PaginatedResponseV3);
  });

  it("should return the items with a filter", async function () {
    // act
    const result = await campaign.getItems({
      limit: 1,
      filter: {
        draft: true,
      },
    });

    // assert
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(PaginatedResponseV3);
    expect(result.data).toBeArrayOfSize(1);
  });
});

describe("getItem", function () {
  it("should return the item", async function () {
    // arrange
    const item = await campaign.addItem({
      recipient: {
        name: "John Doe",
        address: "Houtmarkt 1",
        postalCode: "2011 AL",
        city: "Haarlem",
        country: "Nederland",
      },
      draft: true,
    });

    // act
    const result = await campaign.getItem(item.id);

    // assert
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(CampaignItem);
    expect(result.id).toEqual(item.id);
    expect(result.campaignId).toEqual(campaign.id);
  });

  it("should not return an item from another campaign", async function () {
    // arrange
    const campaign2 = await client.getCampaign(oneOffCampaignId);
    const item = await campaign2.addItem({
      recipient: {
        name: "John Doe",
        address: "Houtmarkt 1",
        postalCode: "2011 AL",
        city: "Haarlem",
        country: "Nederland",
      },
    });

    // act
    const result = campaign.getItem(item.id);

    // assert
    await expect(result).toReject();
  });

  it("should not return a non existing item", async function () {
    // arrange

    // act
    const result = campaign.getItem("non-existing");

    // assert
    await expect(result).toReject();
  });
});

describe("createImport", function () {
  let file: Uint8Array = null as unknown as Uint8Array;

  const mapping: CreateCampaignImport["mapping"] = {
    recipient: {
      name: "{{FirstName}} {{LastName}}",
      addressLine2: "Financial Dpt.",
      address: "{{Street}} {{HouseNr}}",
      postalCode: "{{ZIP}}",
      city: "{{City}}",
      country: "{{Country}}",
    },
  };

  beforeAll(() => {
    file = fs.readFileSync(path.join(__dirname, "assets/test.csv"));
  });

  it("should create an import with all fields", async function () {
    // arrange

    // act
    const imprt = await campaign.createImport({
      mapping: mapping,
      file: file,
    });

    // assert
    expect(imprt).toBeDefined();
    expect(imprt).toEqual(expect.any(CampaignImport));

    expect(imprt.id).toEqual(expect.any(String));
    expect(imprt.draft).toEqual(expect.any(Boolean));
    expect(imprt.status).toEqual(expect.any(String));
    expect(imprt.createdAt).toEqual(expect.any(Date));
    expect(imprt.updatedAt).toEqual(expect.any(Date));
    // if sendDate is undefined, it should be today
    expect(imprt.sendDate.getDay()).toEqual(new Date().getDay());
    expect(imprt.friendlyStatus).toEqual(expect.any(String));
    expect(imprt.mapping).toEqual({
      recipient: mapping.recipient,
      mergeVariables: {},
      sendDate: "",
      sendDateOffset: "",
    });
    expect(imprt.counts).toEqual({
      estimated: expect.any(Number),
      failed: expect.any(Number),
      cancelled: expect.any(Number),
      processed: expect.any(Number),
      total: expect.any(Number),
    });
  });
});

describe("getImports", function () {
  it("should return the imports", async function () {
    // act
    const imports = await campaign.getImports({
      limit: 1,
    });

    // assert
    expect(imports.data).toBeDefined();
    expect(imports.data).toBeInstanceOf(Array);
    expect(imports.data).toBeArrayOfSize(1);
    expect(imports.data[0]).toBeInstanceOf(CampaignImport);
  });
});

describe("getImport", function () {
  let file: Uint8Array = null as unknown as Uint8Array;

  const mapping: CreateCampaignImport["mapping"] = {
    recipient: {
      name: "{{FirstName}} {{LastName}}",
      addressLine2: "Financial Dpt.",
      address: "{{Street}} {{HouseNr}}",
      postalCode: "{{ZIP}}",
      city: "{{City}}",
      country: "{{Country}}",
    },
  };

  beforeAll(() => {
    file = fs.readFileSync(path.join(__dirname, "assets/test.csv"));
  });

  it("should return the import", async function () {
    // arrange
    const createdImport = await campaign.createImport({
      mapping,
      file,
    });

    // act
    const imprt = await campaign.getImport(createdImport.id);

    // assert
    expect(imprt).toBeDefined();
    expect(imprt).toBeInstanceOf(CampaignImport);
  });

  it("should not return a non existing import", async function () {
    // arrange

    // act
    const result = campaign.getImport("non-existing");

    // assert
    await expect(result).toReject();
  });
});
