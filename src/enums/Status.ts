export const Status: {
  order_created: "order_created";
  order_pdf_created: "order_pdf_created";
  order_pdf_queued: "order_pdf_queued";
  order_scheduled: "order_scheduled";
  order_pdf_delivered: "order_pdf_delivered";
  order_cancelled: "order_cancelled";
  order_failed: "order_failed";
} = {
  order_created: "order_created",
  order_pdf_created: "order_pdf_created",
  order_pdf_queued: "order_pdf_queued",
  order_scheduled: "order_scheduled",
  order_pdf_delivered: "order_pdf_delivered",
  order_cancelled: "order_cancelled",
  order_failed: "order_failed",
};

export type Status = (typeof Status)[keyof typeof Status];

export declare const FriendlyStatus: {
  Processing: "Processing";
  Success: "Success";
  Sent: "Sent";
  Scheduled: "Scheduled";
  Cancelled: "Cancelled";
  Failed: "Failed";
};
export type FriendlyStatus =
  (typeof FriendlyStatus)[keyof typeof FriendlyStatus];
