import { OrderPaginatedQuery, Protected } from "../PrintOne";
import { Finish } from "../enums/Finish";
import { Format } from "../enums/Format";
import { Address } from "./Address";
import { Template } from "./Template";
import { ICsvOrder } from "./_interfaces/ICsvOrder";
import { CsvStatus, FriendlyCsvStatusText } from "src/enums/CsvStatus";
import { Order } from "./Order";
import { PaginatedResponse } from "./PaginatedResponse";

export type CreateCsvOrder = {
  file: ArrayBuffer;
  mapping: {
    recipient: Address;
    mergeVariables?: Record<string, string>;
  };
  template: Template | string;
  finish?: Finish;
  billingId?: string;
  sender?: Address;
};

export class CsvOrder {
  private _data: ICsvOrder;

  constructor(
    private readonly _protected: Protected,
    _data: ICsvOrder,
  ) {
    this._data = _data;
  }

  public get id(): string {
    return this._data.id;
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

  public get recipientMapping(): Address {
    return this._data.mapping.recipient;
  }

  public get mergeVariableMapping(): Record<string, string> {
    return this._data.mapping.mergeVariables;
  }

  public get sender(): Address | undefined {
    return this._data.sender;
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

  public get status(): CsvStatus {
    return this._data.status as CsvStatus;
  }

  public get friendlyStatus(): FriendlyCsvStatusText {
    return this._data.friendlyStatus as FriendlyCsvStatusText;
  }

  public get estimatedOrderCount(): number {
    return this._data.estimatedOrderCount;
  }

  public get failedOrderCount(): number {
    return this._data.failedOrderCount;
  }

  public get processedOrderCount(): number {
    return this._data.processedOrderCount;
  }

  public get totalOrderCount(): number {
    return this._data.totalOrderCount;
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

  /**
   * Get the template of the order
   * @throws { PrintOneError } If the template could not be fetched.
   */
  public async getTemplate(): Promise<Template> {
    return this._protected.printOne.getTemplate(this.templateId);
  }

  /**
   * Get all orders from a csv order
   */
  public async getOrders(
    args: Omit<OrderPaginatedQuery, "filter"> & {
      filter?: Omit<OrderPaginatedQuery["filter"], "csvId">;
    },
  ): Promise<PaginatedResponse<Order>> {
    return this._protected.printOne.getOrders({
      ...args,
      filter: {
        ...args.filter,
        csvId: this.id,
      },
    });
  }

  /**
   * Refresh the order, can be used to poll for the status
   * @throws { PrintOneError } If the order could not be refreshed.
   */
  public async refresh(): Promise<void> {
    this._data = await this._protected.client.GET<ICsvOrder>(
      `orders/csv/${this.id}`,
    );
  }
}
