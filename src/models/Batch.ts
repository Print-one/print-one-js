import { OrderPaginatedQuery, Protected } from "../PrintOne";
import { IBatch } from "./_interfaces/IBatch";
import { Finish } from "../enums/Finish";
import { BatchStatus } from "../enums/BatchStatus";
import { Template } from "./Template";
import { PaginatedResponse } from "./PaginatedResponse";
import { Order } from "./Order";
import { Address } from "./Address";
import { IOrder } from "./_interfaces/IOrder";

export type CreateBatch = {
  name: string;
  billingId?: string;
  template: string | Template;
  finish: Finish;
  ready?: Date | boolean;
};

export type CreateBatchOrder = {
  recipient: Address;
  mergeVariables?: Record<string, string>;
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
    return {
      processing: this._data.orders.processing,
      success: this._data.orders.success,
      failed: this._data.orders.failed,
      cancelled: this._data.orders.cancelled,
    };
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
      },
    );

    return new Order(this._protected, data);
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
