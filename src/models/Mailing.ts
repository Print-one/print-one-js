import { Destination } from "~/enums/Destination";
import { Finish } from "~/enums/Finish";
import { Format } from "~/enums/Format";
import { Model } from "~/Model";
import { Protected } from "~/PrintOne";
import { IMailing, IMailingCosts } from "./_interfaces/IMailing";
import { DeliveryType } from "~/enums/DeliveryType";
import { MailingStatus } from "~/enums/MailingStatus";

export class Mailing extends Model<IMailing> {
  constructor(
    protected _protected: Protected,
    _data: IMailing,
  ) {
    super(_protected, _data);
  }

  public get id(): string {
    return this._data.id;
  }

  public get status(): MailingStatus {
    return this._data.status;
  }

  public get createdAt(): Date {
    return new Date(this._data.createdAt);
  }

  public get destination(): Destination {
    return this._data.destination;
  }

  public get format(): Format {
    return this._data.format;
  }

  public get finish(): Finish {
    return this._data.finish;
  }

  public get orderPageCount(): number {
    return this._data.orderPageCount;
  }

  public get orderCount(): number {
    return this._data.orderCount;
  }

  public get templateId(): string {
    return this._data.templateId;
  }

  public get overlay(): string {
    return this._data.overlay;
  }

  public get printingHouseId(): string {
    return this._data.printingHouseId;
  }

  public get deliveryType(): DeliveryType {
    return this._data.deliveryType;
  }

  public get costs(): IMailingCosts {
    return this._data.costs;
  }
}
