import * as fs from "fs";
import * as path from "path";
import { Format } from "~/enums/Format";
import { AddDesign } from "~/models/Design";

export const getFileBuffer = (fileName: string): ArrayBuffer => {
  const buf = fs.readFileSync(path.join(__dirname, fileName));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
};

export const addDesignData: AddDesign = {
  name: "Test Design 1",
  format: Format.POSTCARD_SQ15,
  labels: ["test-design"],
  pages: [{ content: "Page 1 content" }, { content: "Page 2 content" }],
};

export const contCampaignId =
  process.env.CONTINUOUS_CAMPAIGN_ID ?? "e2e-print-one-js-continuous";
export const oneOffCampaignId =
  process.env.ONE_OFF_CAMPAIGN_ID ?? "e2e-print-one-js-one-off";
