import { PrintOne } from "~/index";
import * as process from "process";

export const client = new PrintOne(process.env.API_KEY ?? "", {
  url: process.env.API_URL,
});

export const v3Client = new PrintOne(process.env.API_KEY ?? "", {
  url: process.env.API_URL,
  version: "v3",
});
