import { Address } from "../../models/Address";

export type IOrder = {
  id: string;
  companyId: string;
  templateId: string;
  finish: string;
  format: string;
  mergeVariables: Record<string, unknown>;
  sender?: Address;
  recipient: Address;
  definitiveCountryId: string;
  deliverySpeed: string;
  billingId?: string;
  isBillable: boolean;
  status: string;
  friendlyStatus: string;
  errors: string[];
  sendDate: string;
  createdAt: string;
  updatedAt: string;
  anonymizedAt: string | null;
  csvOrderId: string | null;
  batchId?: string;
};
