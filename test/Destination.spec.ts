import { OneOffDestination } from "~/index";
import { contCampaignId, oneOffCampaignId } from "./Campaign.spec";
import { v3Client } from "./client";

describe("Destination Model", function () {
  it("should have all fields for BaseDestination", async function () {
    // arrange
    const campaign = await v3Client.getCampaign(contCampaignId);
    const destination = campaign.destinations.find(
      (d) => d.destination === "NETHERLANDS",
    );
    if (!destination) {
      throw new Error("Destination NETHERLANDS not found");
    }

    // act

    // assert
    expect(destination.campaignId).toEqual(expect.any(String));
    expect(destination.destination).toEqual(expect.any(String));
    expect(destination.threshold).toEqual(expect.any(Number));
    expect(destination.product).toEqual(expect.any(String));
    expect(destination.finish).toEqual(expect.any(String));
    expect(destination.designId).toBeOneOf([expect.any(String), undefined]);
    expect(destination.variablesFallback).toBeOneOf([
      expect.any(Object),
      undefined,
    ]);
  });

  it('should be able to set "variablesFallback" field', async function () {
    // arrange
    const campaign = await v3Client.getCampaign(contCampaignId);
    const destination = campaign.destinations.find(
      (d) => d.destination === "NETHERLANDS",
    );
    if (!destination) {
      throw new Error("Destination NETHERLANDS not found");
    }

    // act
    destination.variablesFallback = {
      firstName: "Jane",
      lastName: "Doe",
    };

    // assert
    expect(destination.variablesFallback).toEqual({
      firstName: "Jane",
      lastName: "Doe",
    });
  });

  it("should have all fields for OneOffDestination", async function () {
    // arrange
    const campaign = await v3Client.getCampaign(oneOffCampaignId);
    const destination = campaign.destinations.find(
      (d) => d.destination === "NETHERLANDS",
    );

    // act

    // assert
    if (!destination || !(destination instanceof OneOffDestination)) {
      throw new Error("OneOff Destination NETHERLANDS not found");
    }

    expect(destination.campaignId).toEqual(expect.any(String));
    expect(destination.deliveryWeekIso).toEqual(expect.any(Number));
    expect(destination.deliveryWeekYear).toEqual(expect.any(Number));
    expect(destination.asapFallback).toBeOneOf([
      expect.any(Boolean),
      undefined,
    ]);
  });
});
