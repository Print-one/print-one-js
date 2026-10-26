import { PrintOne } from "../src/index";
import * as process from "node:process";

export const client = new PrintOne(process.env.API_KEY ?? "", {
  url: process.env.API_URL,
});
