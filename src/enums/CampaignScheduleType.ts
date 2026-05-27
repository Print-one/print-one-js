export const CampaignScheduleType: {
  CONTINUOUS: "continuous";
  ONE_OFF: "one-off";
} = {
  CONTINUOUS: "continuous",
  ONE_OFF: "one-off",
};

export type CampaignScheduleType =
  (typeof CampaignScheduleType)[keyof typeof CampaignScheduleType];
