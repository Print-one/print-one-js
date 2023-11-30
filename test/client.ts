import { PrintOne } from "../src";
import * as process from "process";

export const client = new PrintOne(process.env.API_KEY ?? "", {
  url: process.env.API_URL,
});
