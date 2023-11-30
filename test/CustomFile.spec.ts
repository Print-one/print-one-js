import { CustomFile } from "../src";
import { client } from "./client";
import * as fs from "fs";
import * as path from "path";

let file: CustomFile = null as unknown as CustomFile;

beforeEach(async function () {
  file = await client.uploadCustomFile(
    "custom-file-test.png",
    fs.readFileSync(path.join(__dirname, "assets/test.png")).buffer,
  );
});

afterEach(async function () {
  try {
    await file.delete();
  } catch (ignore) {
    // ignore
  }
});

describe("download", function () {
  it("should download the file", async function () {
    // arrange

    // act
    const buffer = await file.download();

    // assert
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.byteLength).toEqual(file.size);
  });
});

describe("delete", function () {
  it("should delete the file", async function () {
    // arrange

    // act
    await file.delete();

    // assert
    await expect(file.download()).toReject();
  });
});
