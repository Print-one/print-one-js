import { Protected } from "~/PrintOne";
import { ICouponCode } from "~/models/_interfaces/ICouponCode";
import { Order } from "~/models/Order";
import { IOrder } from "~/models/_interfaces/IOrder";

export class CouponCode {
  private _data: ICouponCode;

  constructor(
    private readonly _protected: Protected,
    _data: ICouponCode,
  ) {
    this._data = _data;
  }

  public get id(): string {
    return this._data.id;
  }

  public get couponId(): string {
    return this._data.couponId;
  }

  public get code(): string {
    return this._data.code;
  }

  public get used(): boolean {
    return this._data.used;
  }

  public get usedAt(): Date | null {
    return this._data.usedAt ? new Date(this._data.usedAt) : null;
  }

  public get orderId(): string | null {
    return this._data.orderId;
  }

  /**
   * Refrsh the coupon code
   * @throws { PrintOneError } If the coupon code could not be refreshed.
   */
  public async refresh(): Promise<void> {
    this._data = await this._protected.client.GET<ICouponCode>(
      `/coupons/${this.couponId}/codes/${this.id}`,
    );
  }

  /**
   * Get the order the coupon was used on
   * @throws { PrintOneError } If the order could not be fetched.
   */
  public async getOrder(): Promise<Order | null> {
    if (!this.orderId) return null;

    const data = await this._protected.client.GET<IOrder>(
      `/orders/${this.orderId}`,
    );
    return new Order(this._protected, data);
  }
}
