Contains information about CustomFiles and methods to download.

# Fields

| Name            | Type     | Description                                   |
| --------------- | -------- | --------------------------------------------- |
| `id`            | `string` | The ID of the CustomFile.                     |
| `fileName`      | `string` | The name of the CustomFile.                   |
| `fileExtension` | `string` | The extension of the CustomFile.              |
| `size`          | `number` | The size of the CustomFile in bytes.          |
| `createdAt`     | `Date`   | The date and time the CustomFile was created. |

# Methods

## `.download()`

Download the CustomFile.

**Returns: `Promise<ArrayBuffer>`**

**Example**

```js
const file = await customFile.download();
```

---

## `.delete()`

Delete the CustomFile.

**Returns: `Promise<void>`**

**Example**

```js
await customFile.delete();
```

---

## [`PrintOne.getCustomFiles([options])`](./PrintOne#getcustomfilesoptions)

Get all custom files.

**Parameters**

| Name             | Type                          | Default          | Description                                                                                               |
| ---------------- | ----------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------- |
| `options.limit`  | `number`                      | `10`             | The maximum number of custom files to return.                                                             |
| `options.page`   | `number`                      | `1`              | The page of custom files to return.                                                                       |
| `options.sortBy` | [`sort`](./Filtering#Sorting) | `createdAt:DESC` | The field(s) to sort the custom files by. Can be `createdAt`, `fileName`, `size`, `id` or `fileExtension` |

**Returns: [`Promise<CustomFile[]>`](./CustomFile)**

**Example**

```js
const customFiles = await client.getCustomFiles({
  limit: 20,
  page: 2,
  sortBy: "fileName:ASC",
});
```

---

## [`PrintOne.uploadCustomFile(fileName, file)`](./PrintOne#uploadcustomfilefilename-file)

Upload a custom file. The file must be a image or font.

**Parameters**

| Name       | Type          | Description                                  |
| ---------- | ------------- | -------------------------------------------- |
| `fileName` | `string`      | The name of the file.                        |
| `file`     | `ArrayBuffer` | The file to upload. Must be a image or font. |

**Returns: [`Promise<CustomFile>`](./CustomFile)**

**Example**

```js
import fs from "fs";

const data = fs.readFileSync("example.png").buffer;
const file = await client.uploadCustomFile("example.png", data);
```
