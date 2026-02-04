import {
  CampaignScheduleType,
  CampaignStatus,
  ContinuousDestination,
  Destination,
  OneOffDestination,
} from "~/index";
import { client } from "./client";
import { addDesignData, contCampaignId, oneOffCampaignId } from "./utils";

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
    expect(campaign.sender).toBeNull();
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
    expect(campaign.sender).toBeNull();
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
