import { Address } from "~/models/Address";
import { Model } from "../Model";
import {
  IContinuousDestination,
  IOneOffDestination,
} from "./_interfaces/IDestination";
import { CampaignScheduleType } from "~/enums/CampaignScheduleType";
import { ICampaign } from "./_interfaces/ICampaign";
import { CampaignStatus } from "~/enums/CampaignStatus";
import { ContinuousDestination, OneOffDestination } from "./Destination";
import { Protected } from "~/PrintOne";
import { Design } from "./Design";
import { IDesign } from "./_interfaces/IDesign";
import { PaginatedResponseV3, ResponseV3 } from "./Response.v3";
import { IPaginatedResponseV3, IResponseV3 } from "./_interfaces/IResponse.v3";

export type CreateCampaign = {
  name: string;
  identifier?: string;
  destinations: IContinuousDestination[] | IOneOffDestination[];
  scheduleType: CampaignScheduleType;
  npdrCategory?: string;
};

export class Campaign extends Model<ICampaign> {
  private _destinations: ContinuousDestination[] | OneOffDestination[] = [];
  private _designs: Design[] = [];

  constructor(
    protected _protected: Protected,
    _data: ICampaign,
  ) {
    super(_protected, _data);
    this.destinations = _data.destinations;
  }

  public get id(): string {
    return this._data.id;
  }

  public get identifier(): string {
    return this._data.identifier;
  }

  public get name(): string {
    return this._data.name;
  }

  public get description(): string | null {
    return this._data.description;
  }

  public get meta(): object | null {
    return this._data.meta;
  }

  public get mergeVariables(): string[] {
    return this._data.mergeVariables;
  }

  public get scheduleType(): CampaignScheduleType {
    return this._data.scheduleType;
  }

  public get companyId(): string {
    return this._data.companyId;
  }

  public get stampId(): string | null {
    return this._data.stampId;
  }

  public get sender(): Address | null {
    return this._data.sender;
  }

  public get billingId(): string | null {
    return this._data.billingId;
  }

  public get status(): CampaignStatus {
    return this._data.status;
  }

  public get npdrCategory(): string | undefined {
    return this._data.npdrCategory;
  }

  public get createdAt(): Date {
    return new Date(this._data.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this._data.updatedAt);
  }

  public get archivedAt(): Date | null {
    return this._data.archivedAt ? new Date(this._data.archivedAt) : null;
  }

  public get destinations(): ContinuousDestination[] | OneOffDestination[] {
    return this._destinations;
  }

  private set destinations(
    destinations: IContinuousDestination[] | IOneOffDestination[],
  ) {
    switch (this.scheduleType) {
      case CampaignScheduleType.CONTINUOUS:
        this._destinations = destinations.map(
          (d) => new ContinuousDestination(this._protected, d),
        );
        break;
      case CampaignScheduleType.ONE_OFF:
        this._destinations = destinations.map(
          (d) =>
            new OneOffDestination(this._protected, d as IOneOffDestination),
        );
        break;
    }
  }

  public get designs(): Design[] {
    return this._designs;
  }

  public async loadDesigns() {
    const data = await this._protected.client.GET<
      IPaginatedResponseV3<IDesign>
    >(`campaigns/${this.id}/designs`);

    this._designs = PaginatedResponseV3.safe(
      this._protected,
      data,
      (data) => new Design(this._protected, data),
    ).data;
  }

  /**
   * Refresh the Campaign
   * @throws { PrintOneError } If the campaign could not be refreshed.
   */
  public async refresh(): Promise<void> {
    const data = await this._protected.client.GET<IResponseV3<ICampaign>>(
      `campaigns/${this.id}`,
    );

    this._data = ResponseV3.safe(
      this._protected,
      data,
      (data) => new Campaign(this._protected, data),
    );

    await this.loadDesigns();
  }
}
