export const CampaignStatus: {
  CREATED: "created";
  RUNNING: "running";
  PAUSED: "paused";
  ARCHIVED: "archived";
} = {
  CREATED: "created",
  RUNNING: "running",
  PAUSED: "paused",
  ARCHIVED: "archived",
};

export type CampaignStatus =
  (typeof CampaignStatus)[keyof typeof CampaignStatus];
