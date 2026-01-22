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
import { Destination } from "~/enums/Destination";

export type UpdateCampaign = {
  name?: string;
  sender?: Address | null;
  ndprCategory?: string;
  /**
   * Discards the existing metadata
   */
  meta?: Record<string, unknown>;
};

export class Campaign extends Model<ICampaign> {
  private _destinations: ContinuousDestination[] | OneOffDestination[] = [];
  private _designs: Design[] = [];
  private designsLoaded: boolean = false;

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

  public get destinations(): ContinuousDestination[] | OneOffDestination[] {
    return this._destinations;
  }

  private set destinations(
    destinations: IContinuousDestination[] | IOneOffDestination[],
  ) {
    switch (this.scheduleType) {
      case CampaignScheduleType.CONTINUOUS:
        this._destinations = destinations.map(
          (d) => new ContinuousDestination(this._protected, d, this.id),
        );
        break;
      case CampaignScheduleType.ONE_OFF:
        this._destinations = destinations.map(
          (d) =>
            new OneOffDestination(
              this._protected,
              d as IOneOffDestination,
              this.id,
            ),
        );
        break;
    }
  }

  public get designs(): Design[] {
    return this._designs;
  }

  public async loadDesigns() {
    let nextPage: number | null = null;

    const newDesigns: Design[] = [];
    do {
      const data: IPaginatedResponseV3<IDesign> =
        await this._protected.client.GET<IPaginatedResponseV3<IDesign>>(
          `campaigns/${this.id}/designs?page=${nextPage ?? 1}`,
        );

      const response = PaginatedResponseV3.safe(
        this._protected,
        data,
        (d) => new Design(this._protected, d, this.id),
      );

      newDesigns.push(...response.data);
      nextPage =
        data.meta.currentPage < data.meta.totalPages
          ? data.meta.currentPage + 1
          : null;
    } while (nextPage);

    this.designsLoaded = true;
    this._designs = newDesigns;
  }

  /**
   * Add variable fallbacks to the campaign's destinations.
   * NOT merging with existing fallbacks, so be sure to include all desired fallbacks for all destinations.
   * @param variablesFallback A record of destination to variable fallbacks
   * @throws { PrintOneError } If the variable fallbacks could not be added
   * @returns { Promise<void> } Updates the destinations in place
   */
  public async addVariablesFallback(
    variablesFallback: Partial<
      Record<Destination, Record<string, string> | null>
    >,
  ): Promise<void> {
    const result = await this._protected.client.PATCH<
      ResponseV3<{
        fallbacks: Partial<
          Record<Destination, { values: Record<string, string> }>
        >;
      }>
    >(`campaigns/${this.id}/variable-fallback`, { variablesFallback });

    for (const dest of this._destinations) {
      const fallback = result.data.fallbacks[dest.destination];
      if (fallback) {
        dest.variablesFallback = fallback.values;
      }
    }
  }

  public async pause(): Promise<void> {
    const response = await this._protected.client.POST<IResponseV3<ICampaign>>(
      `campaigns/${this.id}/pause`,
      {},
    );
    await this._refresh(response);
  }

  public async resume(): Promise<void> {
    const response = await this._protected.client.POST<IResponseV3<ICampaign>>(
      `campaigns/${this.id}/resume`,
      {},
    );
    await this._refresh(response);
  }

  /**
   * Refresh the Campaign
   * @throws { PrintOneError } If the campaign could not be refreshed.
   */
  public async refresh(): Promise<void> {
    const response = await this._protected.client.GET<IResponseV3<ICampaign>>(
      `campaigns/${this.id}`,
    );
    await this._refresh(response);
  }

  private async _refresh(response: IResponseV3<ICampaign>): Promise<void> {
    this._data = response.data;
    this.destinations = response.data.destinations;

    if (this.designsLoaded) {
      await this.loadDesigns();
    }
  }
}
