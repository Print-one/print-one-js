import { ICoupon } from "~/models/_interfaces/ICoupon";
import { Protected } from "~/PrintOne";
import { CouponCode } from "~/models/CouponCode";
import { PaginatedResponse } from "~/models/PaginatedResponse";
import { IPaginatedResponse } from "~/models/_interfaces/IPaginatedResponse";
import { ICouponCode } from "~/models/_interfaces/ICouponCode";

export type CreateCoupon = {
  name: string;
};

export class Coupon {
  private _data: ICoupon;

  constructor(
    private readonly _protected: Protected,
    _data: ICoupon,
  ) {
    this._data = _data;
  }

  public get id(): string {
    return this._data.id;
  }

  public get name(): string {
    return this._data.name;
  }

  public get companyId(): string {
    return this._data.companyId;
  }

  public get stats(): ICoupon["stats"] {
    return this._data.stats;
  }

  /**
   * Refreshes the coupon data
   * @throws { PrintOneError } If the coupon could not be refreshed.
   */
  public async refresh(): Promise<void> {
    this._data = await this._protected.client.GET<ICoupon>(
      `/coupons/${this.id}`,
    );
  }

  /**
   * Get all coupon codes for the coupon
   */
  public async getCodes(): Promise<PaginatedResponse<CouponCode>> {
    const data = await this._protected.client.GET<
      IPaginatedResponse<ICouponCode>
    >(`/coupons/${this.id}/codes`);

    return PaginatedResponse.safe(
      this._protected,
      data,
      (data) => new CouponCode(this._protected, data),
    );
  }

  /**
   * Get all coupon codes for the coupon
   * @throws { PrintOneError } If the coupon code could not be found.
   */
  public async getCode(codeId: string): Promise<CouponCode> {
    const data = await this._protected.client.GET<ICouponCode>(
      `/coupons/${this.id}/codes/${codeId}`,
    );
    return new CouponCode(this._protected, data);
  }

  /**
   * Add coupon codes to coupon with a CSV file
   * The CSV file should have a header column and the first column should be the coupon codes
   * @throws { PrintOneError } If the coupon codes could not be added.
   */
  public async addCodes(csv: ArrayBuffer): Promise<void> {
    const formData = new FormData();
    formData.append("file", new Blob([csv], { type: "text/csv" }), "codes.csv");

    await this._protected.client.POST<void>(`/coupons/${this.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * Delete the coupon
   * @throws { PrintOneError } If the coupon could not be deleted.
   */
  public async delete(): Promise<void> {
    await this._protected.client.DELETE(`/coupons/${this.id}`);
  }
}
