import { Model } from "~/Model";
import { ICampaignItem } from "./_interfaces/ICampaignItem";
import { Address } from "./Address";
import { FriendlyStatus, Status } from "~/enums/Status";
import { sleep } from "~/utils";
import { IResponseV3 } from "./_interfaces/IResponse.v3";

export type CreateCampaignItem = {
  recipient: Address;
  mergeVariables?: Record<string, unknown>;
  sendDate?: Date | string;
  /** @default false */
  draft?: boolean;
  metadata?: Record<string, string | undefined>;
};

export class CampaignItem extends Model<ICampaignItem> {
  public get id(): string {
    return this._data.id;
  }

  public get companyId(): string {
    return this._data.companyId;
  }

  public get campaignId(): string {
    return this._data.campaignId;
  }

  public get templateId(): string {
    return this._data.templateId;
  }

  public get templateVersion(): number {
    return this._data.templateVersion;
  }

  public get finish(): string {
    return this._data.finish;
  }

  public get format(): string {
    return this._data.format;
  }

  public get mergeVariables(): Record<string, unknown> {
    return this._data.mergeVariables;
  }

  public get sender(): Address {
    return this._data.sender;
  }

  public get recipient(): Address {
    return this._data.recipient;
  }

  public get definitiveCountryId(): string {
    return this._data.definitiveCountryId;
  }

  public get region(): string {
    return this._data.region;
  }

  public get draft(): boolean {
    return this._data.draft;
  }

  public get destination(): string {
    return this._data.destination;
  }

  public get status(): Status {
    return this._data.status as Status;
  }

  public get friendlyStatus(): FriendlyStatus {
    return this._data.friendlyStatus as FriendlyStatus;
  }

  public get errors(): string[] {
    return this._data.errors;
  }

  public get warnings(): string[] {
    return this._data.warnings;
  }

  public get metadata(): Record<string, unknown> {
    return this._data.metadata;
  }

  public get sendDate(): Date {
    return new Date(this._data.sendDate);
  }

  public get createdAt(): Date {
    return new Date(this._data.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this._data.updatedAt);
  }

  public get anonymizedAt(): Date | null {
    return this._data.anonymizedAt ? new Date(this._data.anonymizedAt) : null;
  }

  public get importId(): string | null {
    return this._data.importId;
  }

  /**
   * Refresh the item, can be used to poll for the status
   * @throws { PrintOneError } If the item could not be refreshed.
   */
  public async refresh(): Promise<void> {
    this._data = await this._protected.clientV3
      .GET<
        IResponseV3<ICampaignItem>
      >(`campaigns/${this.campaignId}/items/${this.id}`)
      .then((response) => response.data);
  }

  /**
   * Download the item preview
   * @param polling If true, the item will be polled until it has finished processing.
   * @param timeoutSeconds How long it should poll until it gives up.
   * @throws { PrintOneError } If the item could not be downloaded.
   */
  public async download(
    polling = true,
    timeoutSeconds = 20,
  ): Promise<Uint8Array> {
    let time = 0;
    while (
      polling &&
      this.status === Status.order_created &&
      time < timeoutSeconds
    ) {
      await this.refresh();
      await sleep(1000);
      time++;
    }

    return await this._protected.clientV3.GETBuffer(
      `campaigns/${this.campaignId}/items/${this.id}/preview`,
    );
  }

  /**
   * Cancel the item
   * @param polling If true, the item will be polled until it has finished processing.
   * @param timeout How long it should poll until it gives up.
   * @throws { PrintOneError } If the item could not be cancelled.
   */
  public async cancel(polling = true, timeout = 20): Promise<void> {
    let time = 0;
    while (polling && this.status === Status.order_created && time < timeout) {
      await this.refresh();
      await sleep(1000);
      time++;
    }

    this._data = await this._protected.clientV3
      .POST<
        IResponseV3<ICampaignItem>
      >(`campaigns/${this.campaignId}/items/${this.id}/cancel`, {})
      .then((response) => response.data);
  }

  /**
   * Mark the item as deliverable
   * @throws { PrintOneError } If the item could not be marked as deliverable.
   */
  public async markDeliverable(): Promise<void> {
    this._data = await this._protected.clientV3
      .POST<
        IResponseV3<ICampaignItem>
      >(`campaigns/${this.campaignId}/items/${this.id}/send`, {})
      .then((response) => response.data);
  }

  /**
   * Edit the item
   * @param data The data to edit the item with
   * @throws { PrintOneError } If the item could not be edited.
   */
  public async edit(
    data: Pick<CreateCampaignItem, "mergeVariables" | "recipient">,
  ): Promise<void> {
    this._data = await this._protected.clientV3
      .PATCH<
        IResponseV3<ICampaignItem>
      >(`campaigns/${this.campaignId}/items/${this.id}`, data)
      .then((response) => response.data);
  }
}
