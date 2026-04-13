import { Address } from "../Address";

export type ICampaignItem = {
  id: string;
  campaignId: string;
  companyId: string;
  templateId: string;
  templateVersion: number;
  finish: string;
  format: string;
  mergeVariables: Record<string, unknown>;
  sender: Address;
  recipient: Address;
  definitiveCountryId: string;
  region: string;
  draft: boolean;
  destination: string;
  status: string;
  friendlyStatus: string;
  errors: string[];
  warnings: string[];
  metadata: Record<string, unknown>;
  sendDate: string;
  createdAt: string;
  updatedAt: string;
  anonymizedAt: string | null;
  importId: string | null;
};
