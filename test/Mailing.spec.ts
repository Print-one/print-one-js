import { Destination, Finish, Format } from "~/index";
import { v3Client } from "./client";
import { contCampaignId } from "./utils";

describe("Mailing Model", function () {
  it("should have all fields for Mailing", async function () {
    // arrange
    const mailings = await v3Client.getCampaignMailings(contCampaignId, {});

    // act
    if (mailings.data.length === 0) return; // No mailings to test further
    const mailing = mailings.data[0];

    // assert
    expect(mailing.id).toEqual(expect.any(String));
    expect(mailing.status).toEqual(expect.any(String));
    expect(mailing.createdAt).toEqual(expect.any(Date));
    expect(mailing.destination).toBeOneOf(Object.values(Destination));
    expect(mailing.format).toBeOneOf(Object.values(Format));
    expect(mailing.finish).toBeOneOf(Object.values(Finish));
    expect(mailing.orderPageCount).toEqual(expect.any(Number));
    expect(mailing.orderCount).toEqual(expect.any(Number));
    expect(mailing.templateId).toEqual(expect.any(String));
    expect(mailing.overlay).toEqual(expect.any(String));
    expect(mailing.printingHouseId).toEqual(expect.any(String));
    expect(mailing.deliveryType).toEqual(expect.any(String));
    expect(mailing.costs).toEqual(
      expect.objectContaining({
        total: expect.any(Number),
        subtotal: expect.any(Number),
        tax: expect.any(Number),
      }),
    );
  });
});
