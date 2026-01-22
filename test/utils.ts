import * as fs from "fs";
import * as path from "path";

export const getFileBuffer = (fileName: string): ArrayBuffer => {
  const buf = fs.readFileSync(path.join(__dirname, fileName));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
};
