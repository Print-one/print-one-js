export type ICampaignImport = {
  id: string;
  campaignId: string;
  draft: boolean;
  estimatedOrderCount: number;
  failedOrderCount: number;
  cancelledOrderCount: number;
  processedOrderCount: number;
  totalOrderCount: number;
  mapping: {
    recipient: Record<string, string>;
    mergeVariables: Record<string, string>;
    sendDate: string;
    sendDateOffset: string;
  };
  createdAt: string;
  updatedAt: string;
  sendDate: string;
  status: string;
  friendlyStatus: string;
  originId: string;
  originSource: string;
};
