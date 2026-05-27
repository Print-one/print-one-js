export const CsvStatus: {
  import_created: "import_created";
  import_failed: "import_failed";
  import_processed: "import_processed";
  import_cancelled: "import_cancelled";
} = {
  import_created: "import_created",
  import_failed: "import_failed",
  import_processed: "import_processed",
  import_cancelled: "import_cancelled",
};

export type CsvStatus = (typeof CsvStatus)[keyof typeof CsvStatus];

export const FriendlyCsvStatusText: {
  Processing: "Processing";
  Success: "Success";
  Failed: "Failed";
  Cancelled: "Cancelled";
} = {
  Processing: "Processing",
  Success: "Success",
  Failed: "Failed",
  Cancelled: "Cancelled",
};

export type FriendlyCsvStatusText =
  (typeof FriendlyCsvStatusText)[keyof typeof FriendlyCsvStatusText];

export const FriendlyCsvStatus: {
  [key in CsvStatus]: FriendlyCsvStatusText;
} = {
  import_created: "Processing",
  import_failed: "Failed",
  import_processed: "Success",
  import_cancelled: "Cancelled",
};

export type FriendlyCsvStatus = typeof FriendlyCsvStatus;
