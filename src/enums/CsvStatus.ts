export const CsvStatus: {
  order_created: "order_created";
  order_processed: "order_processed";
} = {
  order_created: "order_created",
  order_processed: "order_processed",
};

export type CsvStatus = (typeof CsvStatus)[keyof typeof CsvStatus];

export const FriendlyCsvStatusText: {
  Processing: "Processing";
  Success: "Success";
} = {
  Processing: "Processing",
  Success: "Success",
};

export type FriendlyCsvStatusText =
  (typeof FriendlyCsvStatusText)[keyof typeof FriendlyCsvStatusText];

export const FriendlyCsvStatus: {
  [key in CsvStatus]: FriendlyCsvStatusText;
} = {
  order_created: "Processing",
  order_processed: "Success",
};

export type FriendlyCsvStatus = typeof FriendlyCsvStatus;
