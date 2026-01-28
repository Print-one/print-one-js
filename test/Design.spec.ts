import { Destination } from "~/index";
import { contCampaignId } from "./Campaign.spec";
import { v3Client } from "./client";
import { addDesignData } from "./PrintOne.spec";

describe("Design Model", function () {
  it("should have all fields for Design", async function () {
    // arrange
    const newDesign = await v3Client.addDesignToDestination(
      contCampaignId,
      Destination.NETHERLANDS,
      addDesignData,
    );
    const campaign = await v3Client.getCampaign(contCampaignId);

    await campaign.loadDesigns();

    // act
    const design = campaign.designs.find(
      (d) => d.destination === Destination.NETHERLANDS && d.id === newDesign.id,
    );
    if (!design) {
      throw new Error("Design not found in campaign designs");
    }

    // assert
    expect(design.campaignId).toEqual(campaign.id);
    expect(design.id).toEqual(expect.any(String));
    expect(design.version).toEqual(expect.any(Number));
    expect(design.name).toEqual(expect.any(String));
    expect(design.format).toBe(addDesignData.format);
    expect(design.overlay).toEqual(expect.any(String));
    expect(design.labels).toEqual(expect.any(Array));
    expect(design.mergeVariables).toEqual(expect.any(Array));
    expect(design.thumbnail).toBeOneOf([expect.any(String), null]);
    expect(design.apiVersion).toEqual(expect.any(Number));
    expect(design.updatedAt).toBeOneOf([expect.any(Date), undefined]);
    expect(design.destination).toEqual(Destination.NETHERLANDS);
    expect(design.default).toBe(false);
  });

  it("should be able to make a Design default", async function () {
    // arrange
    const campaign = await v3Client.getCampaign(contCampaignId);
    await campaign.loadDesigns();
    const design = await v3Client.addDesignToDestination(
      campaign.id,
      Destination.NETHERLANDS,
      addDesignData,
    );

    // act
    await design.makeDefault();

    // assert
    await campaign.refresh();
    const destination = campaign.destinations.find(
      (d) => d.destination === Destination.NETHERLANDS,
    );
    if (!destination) {
      throw new Error("Destination NETHERLANDS not found");
    }

    expect(destination.designId).toBe(design.id);
  }, 10000);

  it("should load full Design data", async function () {
    // arrange
    const design = await v3Client.addDesignToDestination(
      contCampaignId,
      Destination.NETHERLANDS,
      addDesignData,
    );

    // act
    await design.load();

    // assert
    expect(design.pages).toBeDefined();
    expect(design.serializedHelperCalls).toBeDefined();
  });

  it("should throw if calling unloaded properties before loading full Design data", async function () {
    // arrange
    const campaign = await v3Client.getCampaign(contCampaignId);
    await campaign.loadDesigns();
    const design = campaign.designs[0];

    // act & assert
    expect(() => {
      return design.pages;
    }).toThrow("Design pages are not loaded, call 'load()' first");

    expect(() => {
      return design.serializedHelperCalls;
    }).toThrow(
      "Design serializedHelperCalls are not loaded, call 'load()' first",
    );
  });
});
