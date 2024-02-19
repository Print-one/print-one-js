export type IBatch = {
  id: string;
  companyId: string;
  name: string;
  billingId: string;
  finish: string;
  isBillable: boolean;
  templateId: string;
  estimatedPrice: number;
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
