import { Model } from "~/Model";
import { Address } from "./Address";
import { ICampaignImport } from "./_interfaces/ICampaignImport";
import { CsvStatus, FriendlyCsvStatusText } from "~/enums/CsvStatus";
import { Campaign, CampaignItem, ItemPaginatedQuery } from "..";
import { PaginatedResponseV3 } from "./Response.v3";
import { IResponseV3 } from "./_interfaces/IResponse.v3";
import { ICampaignItem } from "./_interfaces/ICampaignItem";
import { UnsafeCreationContext } from "../types";

export type CreateCampaignImport = {
  file: ArrayBuffer | Uint8Array;
  mapping: {
    recipient: Address;
    mergeVariables?: Record<string, string>;
    sendDate?: string;
    sendDateOffset?: string;
  };
  /** @internal */
  __source?: {
    integrationId: string;
    integrationType: string;
    scheduleId?: string;
  };
  draft?: boolean;
};

export class CampaignImport extends Model<ICampaignImport> {
  public static createUnsafe(
    ctx: UnsafeCreationContext,
    data: Pick<ICampaignImport, "id" | "campaignId">,
  ): CampaignImport {
    // @ts-expect-error - We know the _protected is protected, but as an internal method we can access it just fine
    return new CampaignImport(ctx._protected, {
      id: data.id,
      campaignId: data.campaignId,
    } as ICampaignImport);
  }

  public get id(): string {
    return this._data.id;
  }

  public get campaignId(): string {
    return this._data.campaignId;
  }

  public get draft(): boolean {
    return this._data.draft;
  }

  public get counts(): {
    estimated: number;
    failed: number;
    cancelled: number;
    processed: number;
    total: number;
  } {
    return {
      estimated: this._data.estimatedOrderCount,
      failed: this._data.failedOrderCount,
      cancelled: this._data.cancelledOrderCount,
      processed: this._data.processedOrderCount,
      total: this._data.totalOrderCount,
    };
  }

  public get mapping(): ICampaignImport["mapping"] {
    return this._data.mapping;
  }

  public get createdAt(): Date {
    return new Date(this._data.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this._data.updatedAt);
  }

  public get sendDate(): Date {
    return new Date(this._data.sendDate);
  }

  public get status(): CsvStatus {
    return this._data.status as CsvStatus;
  }

  public get friendlyStatus(): FriendlyCsvStatusText {
    return this._data.friendlyStatus as FriendlyCsvStatusText;
  }

  /**
   * Refresh the Import
   * @throws { PrintOneError } If the campaign could not be refreshed.
   */
  public async refresh(): Promise<void> {
    const response = await this._protected.clientV3.GET<
      IResponseV3<ICampaignImport>
    >(`campaigns/${this.campaignId}/imports/${this.id}`);
    await this._refresh(response);
  }

  private async _refresh(
    response: IResponseV3<ICampaignImport>,
  ): Promise<void> {
    this._data = response.data;
  }

  /**
   * Get all items in the import
   */
  public async getItems(
    args: Omit<ItemPaginatedQuery, "filter"> & {
      filter: Omit<ItemPaginatedQuery["filter"], "importId">;
    },
  ): Promise<PaginatedResponseV3<CampaignItem>> {
    const campaign = Campaign.createUnsafe(this, this.campaignId);

    return campaign.getItems({
      ...args,
      filter: {
        ...args.filter,
        importId: this.id,
      },
    });
  }

  /**
   * Cancel the import, this will cancel all items in the import and stop processing as soon as possible
   */
  public async cancel(): Promise<void> {
    const response = await this._protected.clientV3.POST<
      IResponseV3<ICampaignImport>
    >(`campaigns/${this.campaignId}/imports/${this.id}/cancel`, {});
    await this._refresh(response);
  }

  /**
   * Start processing the import, starts processing all items in the import
   */
  public async process(): Promise<void> {
    await this._protected.clientV3.POST<IResponseV3<ICampaignImport>>(
      `campaigns/${this.campaignId}/imports/${this.id}/process`,
      {},
    );
    await this.refresh();
  }

  /**
   * Get a preview item for a specific row in the import, this will create a draft item for the row
   */
  public async previewRow(rowId: number): Promise<CampaignItem> {
    const response = await this._protected.clientV3.POST<
      IResponseV3<ICampaignItem>
    >(`campaigns/${this.campaignId}/imports/${this.id}/preview/${rowId}`, {});
    return new CampaignItem(this._protected, response.data);
  }

  /**
   * Definitively send the import, this will set all items as deliverable and send them
   */
  public async send(): Promise<void> {
    await this._protected.clientV3.POST<IResponseV3<ICampaignImport>>(
      `campaigns/${this.campaignId}/imports/${this.id}/send`,
      {},
    );
    await this.refresh();
  }
}
