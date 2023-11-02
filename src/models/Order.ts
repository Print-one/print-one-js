import { IOrder } from "./_interfaces/IOrder";
import { Protected } from "../PrintOne";
import { Finish } from "../enums/Finish";
import { Format } from "../enums/Format";
import { Address } from "../models/Address";
import { Template } from "./Template";
import { Status } from "../enums/Status";
import { sleep } from "../utils";

export class Order {
  private _data: IOrder;

  constructor(
    private readonly _protected: Protected,
    _data: IOrder,
  ) {
    this._data = _data;
  }

  public get id(): string {
    return this._data.id;
  }

  public get companyId(): string {
    return this._data.companyId;
  }

  public get templateId(): string {
    return this._data.templateId;
  }

  public get finish(): Finish {
    return this._data.finish as Finish;
  }

  public get format(): Format {
    return this._data.format as Format;
  }

  public get mergeVariables(): Record<string, unknown> {
    return this._data.mergeVariables;
  }

  public get sender(): Address | undefined {
    return this._data.sender;
  }

  public get recipient(): Address {
    return this._data.recipient;
  }

  public get definitiveCountryId(): string {
    return this._data.definitiveCountryId;
  }

  public get deliverySpeed(): string {
    return this._data.deliverySpeed;
  }

  public get billingId(): string | undefined {
    return this._data.billingId;
  }

  /**
   * True if the order is created using a live API key.
   */
  public get isBillable(): boolean {
    return this._data.isBillable;
  }

  public get status(): Status {
    return this._data.status as Status;
  }

  public get friendlyStatus(): string {
    return this._data.friendlyStatus;
  }

  public get errors(): string[] {
    return this._data.errors;
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

  public get anonymizedAt(): Date | undefined {
    return this._data.anonymizedAt
      ? new Date(this._data.anonymizedAt)
      : undefined;
  }

  /**
   * Get the template of the order
   * @throws { PrintOneError } If the template could not be fetched.
   */
  public async getTemplate(): Promise<Template> {
    return this._protected.printOne.getTemplate(this.templateId);
  }

  /**
   * Refresh the order, can be used to poll for the status
   * @throws { PrintOneError } If the order could not be refreshed.
   */
  public async refresh(): Promise<void> {
    this._data = await this._protected.client.GET<IOrder>(`orders/${this.id}`);
  }

  /**
   * Download the order preview
   * @param polling If true, the order will be polled until it has finished processing.
   * @param timeoutSeconds How long it should poll until it gives up.
   * @throws { PrintOneError } If the order could not be downloaded.
   */
  public async download(
    polling = true,
    timeoutSeconds = 20,
  ): Promise<ArrayBuffer> {
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

    return await this._protected.client.GET<ArrayBuffer>(
      `storage/order/preview/${this.id}`,
      {
        responseType: "arraybuffer",
      },
    );
  }

  /**
   * Cancel the order
   * @param polling If true, the order will be polled until it has finished processing.
   * @param timeout How long it should poll until it gives up.
   * @throws { PrintOneError } If the order could not be cancelled.
   */
  public async cancel(polling = true, timeout = 20): Promise<void> {
    let time = 0;
    while (polling && this.status === Status.order_created && time < timeout) {
      await this.refresh();
      await sleep(1000);
      time++;
    }

    this._data = await this._protected.client.POST<IOrder>(
      `orders/${this.id}/cancel`,
      {},
    );
  }
}
