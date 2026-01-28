import { Model } from "~/Model";
import { Destination } from "~/enums/Destination";
import {
  ICampaignCounts,
  IDestinationCounts,
} from "./_interfaces/ICampaignCounts";
import { Protected } from "~/index";

export class DestinationCounts extends Model<IDestinationCounts> {
  public get draft(): number {
    return this._data.draft;
  }

  public get next(): number {
    return this._data.next;
  }

  public get scheduled(): number {
    return this._data.scheduled;
  }

  public get sent(): number {
    return this._data.sent;
  }

  public get failed(): number {
    return this._data.failed;
  }

  public get cancelled(): number {
    return this._data.cancelled;
  }

  public get total(): number {
    return this._data.total;
  }
}

export class CampaignCounts extends Model<ICampaignCounts> {
  private _destinations: Record<Destination, DestinationCounts>;

  constructor(_protected: Protected, data: ICampaignCounts) {
    super(_protected, data);

    const destinations: Record<Destination, DestinationCounts> = {} as Record<
      Destination,
      DestinationCounts
    >;
    for (const key in this._data.destinations) {
      const destinationKey = key as Destination;
      destinations[destinationKey] = new DestinationCounts(
        this._protected,
        this._data.destinations[destinationKey],
      );
    }
    this._destinations = destinations;
  }

  public get total(): number {
    return this._data.total;
  }

  public get destinations(): Record<Destination, DestinationCounts> {
    return this._destinations;
  }
}
