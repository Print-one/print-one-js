import { OrderPaginatedQuery, Protected } from "~/PrintOne";
import { IBatch } from "~/models/_interfaces/IBatch";
import { Finish } from "~/enums/Finish";
import { BatchStatus } from "~/enums/BatchStatus";
import { Template } from "~/models/Template";
import { PaginatedResponse } from "~/models/PaginatedResponse";
import { Order } from "~/models/Order";
import { Address } from "~/models/Address";
import { IOrder } from "~/models/_interfaces/IOrder";
import { Format } from "~/enums/Format";
import { CreateBatchCsvOrder, CsvOrder } from "~/models/CsvOrder";
import { ICsvOrder } from "~/models/_interfaces/ICsvOrder";

export type CreateBatch = {
  name: string;
  billingId?: string;
  template: string | Template;
  finish: Finish;
  ready?: Date | boolean;
  sender: Address;
};

export type CreateBatchOrder = {
  recipient: Address;
  mergeVariables?: Record<string, string>;
  autoGenNextBatch?: boolean;
};

export class Batch {
  private _data: IBatch;

  constructor(
    private readonly _protected: Protected,
    _data: IBatch,
  ) {
    this._data = _data;
  }

  public get id(): string {
    return this._data.id;
  }

  public get companyId(): string {
    return this._data.companyId;
  }

  public get name(): string {
    return this._data.name;
  }

  public get billingId(): string | undefined {
    return this._data.billingId;
  }

  public get finish(): Finish {
    return this._data.finish as Finish;
  }

  public get format(): Format {
    return this._data.format as Format;
  }

  public get isBillable(): boolean {
    return this._data.isBillable;
  }

  public get templateId(): string {
    return this._data.templateId;
  }

  public get estimatedPrice(): number {
    return this._data.estimatedPrice;
  }

  public get sendDate(): Date | undefined {
    return this._data.sendDate ? new Date(this._data.sendDate) : undefined;
  }

  public get status(): BatchStatus {
    return this._data.status as BatchStatus;
  }

  public get orders(): {
    processing: number;
    success: number;
    failed: number;
    cancelled: number;
  } {
    return this._data.orders;
  }

  public get createdAt(): Date {
    return new Date(this._data.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this._data.updatedAt);
  }

  /**
   * Refreshes the batch data, can be used to poll for status changes.
   */
  public async refresh(): Promise<void> {
    this._data = await this._protected.client.GET<IBatch>(
      `/batches/${this.id}`,
    );
  }

  /**
   * Get the template of the batch
   * @throws { PrintOneError } If the template could not be fetched.
   */
  public async getTemplate(): Promise<Template> {
    return this._protected.printOne.getTemplate(this.templateId);
  }

  /**
   * Get a single order from the batch
   */
  public async getOrder(orderId: string): Promise<Order> {
    return this._protected.printOne.getOrder(
      orderId,
      `batches/${this.id}/orders`,
    );
  }

  /**
   * Get all orders from a csv order
   */
  public async getOrders(
    args: Omit<OrderPaginatedQuery, "filter"> & {
      filter?: Omit<OrderPaginatedQuery["filter"], "batchId">;
    } = {},
  ): Promise<PaginatedResponse<Order>> {
    return this._protected.printOne.getOrders(
      args,
      `batches/${this.id}/orders`,
    );
  }

  /**
   * Create a new order in the batch
   */
  public async createOrder(order: CreateBatchOrder): Promise<Order> {
    const data = await this._protected.client.POST<IOrder>(
      `/batches/${this.id}/orders`,
      {
        recipient: order.recipient,
        mergeVariables: order.mergeVariables,
        autoGenNextBatch: order.autoGenNextBatch,
      },
    );

    return new Order(this._protected, data);
  }

  public async createCsvOrder(data: CreateBatchCsvOrder): Promise<CsvOrder> {
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([data.file], { type: "text/csv" }),
      "upload.csv",
    );
    formData.append("mapping", JSON.stringify(data.mapping));

    const response = await this._protected.client.POST<{ id: string }>(
      `/batches/${this.id}/orders/csv`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const id = response.id;
    const csvInfo = await this._protected.client.GET<ICsvOrder>(
      `batches/${this.id}/orders/csv/${id}`,
    );

    return new CsvOrder(this._protected, csvInfo);
  }

  /**
   * Get a csv order by its id.
   * @param { string } id The id of the csv order.
   * @param basePath The basePath to use for this request
   * @throws { PrintOneError } If the order could not be found.
   */
  public async getCsvOrder(id: string): Promise<CsvOrder> {
    return this._protected.printOne.getCsvOrder(id, `batches/${this.id}`);
  }

  /**
   * Update the batch
   *
   * <i>Note: Only the `ready` field can be updated.</i>
   */
  public async update(data: { ready: Date | boolean }): Promise<void> {
    this._data = await this._protected.client.PATCH<IBatch>(
      `/batches/${this.id}`,
      {
        ready: data.ready === false ? null : data.ready,
      },
    );
  }
}
