import { Address } from "~/models/Address";

export type IBatch = {
  id: string;
  companyId: string;
  name: string;
  billingId: string;
  finish: string;
  format: string;
  isBillable: boolean;
  templateId: string;
  estimatedPrice: number;
  estimatedTax: number;
  sender: Address;
  sendDate: string | null;
  status: string;
  orders: {
    processing: number;
    success: number;
    failed: number;
    cancelled: number;
  };
  createdAt: string;
  updatedAt: string;
};
