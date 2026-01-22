import { CampaignScheduleType } from "~/enums/CampaignScheduleType";
import { CampaignStatus } from "~/enums/CampaignStatus";
import { Address } from "~/models/Address";

import { IContinuousDestination, IOneOffDestination } from "./IDestination";

export type ICampaign = {
  id: string;
  identifier: string;
  name: string;
  description: string | null;
  meta: object | null;
  mergeVariables: string[];
  scheduleType: CampaignScheduleType;
  stampId: string | null;
  sender: Address | null;
  billingId: string | null;
  status: CampaignStatus;
  npdrCategory?: string;
  createdAt: Date;
  updatedAt: Date;
  destinations: IContinuousDestination[] | IOneOffDestination[];
};
