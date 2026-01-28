import { DestinationCounts } from "~/models/CampaignCounts";
import { v3Client } from "./client";
import { contCampaignId } from "./utils";

describe("CampaignCounts Model", function () {
  // This test assumes that the campaign has destinations with at least one order
  it("should have all properties defined", async function () {
    // arrange
    const campaignCounts = await v3Client.getCampaignCounts(contCampaignId);

    // assert
    expect(campaignCounts.total).toEqual(expect.any(Number));

    for (const destKey in campaignCounts.destinations) {
      const destCounts =
        campaignCounts.destinations[
          destKey as keyof typeof campaignCounts.destinations
        ];

      expect(destCounts).toBeInstanceOf(DestinationCounts);
      expect(destCounts.draft).toEqual(expect.any(Number));
      expect(destCounts.next).toEqual(expect.any(Number));
      expect(destCounts.scheduled).toEqual(expect.any(Number));
      expect(destCounts.sent).toEqual(expect.any(Number));
      expect(destCounts.failed).toEqual(expect.any(Number));
      expect(destCounts.cancelled).toEqual(expect.any(Number));
      expect(destCounts.total).toEqual(expect.any(Number));
    }
  });
});
