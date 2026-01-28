import { Model } from "~/Model";
import {
  IBaseDestination,
  IContinuousDestination,
  IOneOffDestination,
} from "./_interfaces/IDestination";
import { Destination } from "~/enums/Destination";
import { Format } from "~/enums/Format";
import { Finish } from "~/enums/Finish";
import { Protected } from "~/PrintOne";

class BaseDestination<T extends IBaseDestination> extends Model<T> {
  constructor(
    protected _protected: Protected,
    _data: T,
    public campaignId: string,
  ) {
    super(_protected, _data);
  }

  public get destination(): Destination {
    return this._data.destination;
  }

  public get threshold(): number {
    return this._data.threshold;
  }

  public get product(): Format {
    return this._data.product;
  }

  public get finish(): Finish {
    return this._data.finish;
  }

  public get designId(): string | undefined {
    return this._data.designId;
  }

  public get variablesFallback():
    | Record<string, string | number | boolean>
    | undefined {
    return this._data.variablesFallback;
  }

  public set variablesFallback(
    value: Record<string, string | number | boolean> | undefined,
  ) {
    this._data.variablesFallback = value;
  }
}

export class ContinuousDestination extends BaseDestination<IContinuousDestination> {
  // No additional fields
}

export class OneOffDestination extends BaseDestination<IOneOffDestination> {
  public get deliveryWeekIso(): number {
    return this._data.deliveryWeekIso;
  }

  public get deliveryWeekYear(): number {
    return this._data.deliveryWeekYear;
  }

  public get asapFallback(): boolean | undefined {
    return this._data.asapFallback;
  }
}
