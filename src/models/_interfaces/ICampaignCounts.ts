import { Destination } from "~/enums/Destination";

export type IDestinationCounts = {
  draft: number;
  next: number;
  scheduled: number;
  sent: number;
  failed: number;
  cancelled: number;
  total: number;
};

export type ICampaignCounts = {
  total: number;
  destinations: Record<Destination, IDestinationCounts>;
};
