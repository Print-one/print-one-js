import { Address } from "~/models/Address";

export type ICsvOrder = {
  id: string;
  estimatedOrderCount: number;
  failedOrderCount: number;
  processedOrderCount: number;
  totalOrderCount: number;
  templateId: string;
  mapping: {
    recipient: Address;
    mergeVariables: Record<string, string>;
  };
  finish: string;
  format: string;
  createdAt: Date;
  updatedAt: Date;
  sendDate: Date;
  isBillable: boolean;
  status: string;
  friendlyStatus: string;
  sender?: Address;
  billingId?: string;
};
