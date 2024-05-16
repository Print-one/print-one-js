export const BatchStatus: {
  batch_created: "batch_created";
  batch_needs_approval: "batch_needs_approval";
  batch_user_ready: "batch_user_ready";
  batch_ready_to_schedule: "batch_ready_to_schedule";
  batch_scheduling: "batch_scheduling";
  batch_scheduled: "batch_scheduled";
  batch_sent: "batch_sent";
} = {
  batch_created: "batch_created",
  batch_needs_approval: "batch_needs_approval",
  batch_user_ready: "batch_user_ready",
  batch_ready_to_schedule: "batch_ready_to_schedule",
  batch_scheduling: "batch_scheduling",
  batch_scheduled: "batch_scheduled",
  batch_sent: "batch_sent",
};

export type BatchStatus = (typeof BatchStatus)[keyof typeof BatchStatus];
