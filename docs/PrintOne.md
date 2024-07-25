The main class of the library. It is used to create a client for the Print.one API.

# Constructor

```js
import { PrintOne } from "@print-one/print-one-js";

const client = new PrintOne(apiKey);
```

# Methods

## `.getSelf()`

Get the company that the API key belongs to.

**Returns: [`Promise<Company>`](./Company)**

**Example**

```js
const company = await client.getSelf();
```

---

## `.getCustomFiles([options])`

Get all custom files.

**Parameters**

| Name             | Type                          | Default          | Description                                                                                               |
| ---------------- | ----------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------- |
| `options.limit`  | `number`                      | `10`             | The maximum number of custom files to return.                                                             |
| `options.page`   | `number`                      | `1`              | The page of custom files to return.                                                                       |
| `options.sortBy` | [`sort`](./Filtering#Sorting) | `createdAt:DESC` | The field(s) to sort the custom files by. Can be `createdAt`, `fileName`, `size`, `id` or `fileExtension` |

**Returns: [`Promise<PaginatedResponse<CustomFile>>`](./CustomFile)**

**Example**

```js
const customFiles = await client.getCustomFiles({
  limit: 20,
  page: 2,
  sortBy: "fileName:ASC",
});
```

---

## `.uploadCustomFile(fileName, file)`

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

---

## `.createTemplate(data)`

Create a new template.

**Parameters**

| Name          | Type                      | Description                                                                                             |
| ------------- | ------------------------- | ------------------------------------------------------------------------------------------------------- |
| `data.name`   | `string`                  | The name of the template.                                                                               |
| `data.format` | `string`                  | The format of the template. Can be `POSTCARD_A5`, `POSTCARD_A6`, `POSTCARD_SQ14` or `GREETINGCARD_SQ15` |
| `data.labels` | `string[]` \| `undefined` | The labels of the template.                                                                             |
| `data.pages`  | `string[]`                | The pages of the template.                                                                              |

**Returns: [`Promise<Template>`](./Template)**

**Example**

```js
const template = await client.createTemplate({
  name: "Example Template",
  format: Format.POSTCARD_A5,
  labels: ["example"],
  pages: ["front", "back"],
});
```

## `.getTemplates([options])`

Get all templates.

**Parameters**

| Name                    | Type                               | Default          | Description                                                                                                                |
| ----------------------- | ---------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `options.limit`         | `number`                           | `10`             | The maximum number of templates to return.                                                                                 |
| `options.page`          | `number`                           | `1`              | The page of templates to return.                                                                                           |
| `options.sortBy`        | [`sort`](./Filtering#Sorting)      | `updatedAt:DESC` | The field(s) to sort the templates by. Can be `updatedAt`                                                                  |
| `options.filter.name`   | `string` \| `string[]`             | `undefined`      | The name(s) of the template(s) to filter by.                                                                               |
| `options.filter.labels` | [`contains`](./Filtering#Contains) | `undefined`      | The label(s) of the template(s) to filter by.                                                                              |
| `options.filter.format` | `string` \| `string[]`             | `undefined`      | The format(s) of the template(s) to filter by. Can be `POSTCARD_A5`, `POSTCARD_A6`, `POSTCARD_SQ14` or `GREETINGCARD_SQ15` |

**Returns: [`Promise<PaginatedResponse<Template>>`](./Template)**

**Example**

```js
const templates = await client.getTemplates({
  limit: 20,
  page: 1,
  sortBy: "updatedAt:ASC",
  filter: {
    name: "Example Template",
    labels: "example",
    format: Format.POSTCARD_A5,
  },
});
```

---

## `.getTemplate(id)`

Get a template by its ID.

**Parameters**

| Name | Type     | Description                    |
| ---- | -------- | ------------------------------ |
| `id` | `string` | The ID of the template to get. |

**Returns: [`Promise<Template>`](./Template)**

**Example**

```js
const template = await client.getTemplate("example-template-id");
```

---

## `.createOrder(data)`

Create a new order.

**Parameters**

| Name   | Type     | Description                                                                              |
| ------ | -------- | ---------------------------------------------------------------------------------------- |
| `data` | `object` | The data to create the order with. See [`Order`](./Order#createorderdata) for more info. |

**Returns: [`Promise<Order>`](./Order)**

**Example**

```js
const order = await client.createOrder({
  template: "example-template-id",
  recipient: {
    name: "John Doe",
    address: "Example Street 2",
    city: "Anytown",
    postalCode: "1234AB",
    country: "NL",
  },
});
```

---

## `.getOrder(id)`

Get an order by its ID.

**Parameters**

| Name | Type     | Description                 |
| ---- | -------- | --------------------------- |
| `id` | `string` | The ID of the order to get. |

**Returns: [`Promise<Order>`](./Order)**

**Example**

```js
const order = await client.getOrder("example-order-id");
```

---

## `.getOrders([options])`

Get all orders.

**Parameters**

| Name                            | Type                          | Default          | Description                                                                                                                        |
| ------------------------------- | ----------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `options.limit`                 | `number`                      | `10`             | The maximum number of orders to return.                                                                                            |
| `options.page`                  | `number`                      | `1`              | The page of orders to return.                                                                                                      |
| `options.sortBy`                | [`sort`](./Filtering#Sorting) | `createdAt:DESC` | The field(s) to sort the orders by. Can be `createdAt`, `anonymizedAt`, `updatedAt`, `friendlyStatus` or `sendDate`                |
| `options.filter.friendlyStatus` | `string` \| `string[]`        | `undefined`      | The friendly status(es) of the order(s) to filter by. Can be `Processing`, `Success`, `Sent`, `Scheduled`, `Cancelled` or `Failed` |
| `options.filter.billingId`      | `string` \| `string[]`        | `undefined`      | The billing ID(s) of the order(s) to filter by.                                                                                    |
| `options.filter.format`         | `string` \| `string[]`        | `undefined`      | The format(s) of the order(s) to filter by. Can be `POSTCARD_A5`, `POSTCARD_A6`, `POSTCARD_SQ14` or `GREETINGCARD_SQ15`            |
| `options.filter.finish`         | `string` \| `string[]`        | `undefined`      | The finish(es) of the order(s) to filter by. Can be `GLOSSY` or `MATTE`                                                            |
| `options.filter.isBillable`     | `boolean`                     | `undefined`      | Whether the order(s) are live order or test orders.                                                                                |
| `options.filter.createdAt`      | [`date`](./Filtering#Date)    | `undefined`      | The date(s) the order(s) were created on.                                                                                          |

**Returns: [`Promise<PaginatedResponse<Order>>`](./Order)**

**Example**

```js
const orders = await client.getOrders({
  limit: 20,
  page: 1,
  sortBy: "createdAt:ASC",
  filter: {
    friendlyStatus: "Success",
    billingId: "example-billing-id",
    format: Format.POSTCARD_A5,
    finish: Finish.GLOSSY,
    isBillable: true,
    createdAt: {
      from: "2020-01-01",
      to: "2020-01-31",
    },
  },
});
```

---

## `.createCsvOrder(data)`

Create a new csv order.

**Parameters**

| Name   | Type     | Description                                                                                       |
| ------ | -------- | ------------------------------------------------------------------------------------------------- |
| `data` | `object` | The data to create the order with. See [`CsvOrder`](./CsvOrder#createcsvorderdata) for more info. |

**Returns: [`Promise<CsvOrder>`](./CsvOrder)**

**Example**

```js
const order = await client.createCsvOrder({
  mapping: {
    recipient: {
      city: "{{City}}",
      name: "{{FirstName}} {{LastName}}",
      address: "{{Street}} {{HouseNr}}",
      country: "{{Country}}",
      postalCode: "{{ZIP}}",
    },
    mergeVariables: {
      name: "{{FirstName}}",
      coupon: "{{Coupon}}",
    },
  },
  template: template,
  file: file,
});
```

---

## `.getCsvOrder(id)`

Get a csv order by its ID.

**Parameters**

| Name | Type     | Description                     |
| ---- | -------- | ------------------------------- |
| `id` | `string` | The ID of the csv order to get. |

**Returns: [`Promise<CsvOrder>`](./CsvOrder)**

**Example**

```js
const csvOrder = await client.getCsvOrder("example-order-id");
```

```

```

--

## `.createCoupon(data)`

Create a new coupon.

**Parameters**

| Name   | Type     | Description                                                                                 |
| ------ | -------- | ------------------------------------------------------------------------------------------- |
| `data` | `object` | The data to create the coupon with. See [`Order`](./Coupon#createcoupondata) for more info. |

**Returns: [`Promise<Coupon>`](./Order)**

**Example**

```js
const coupon = await client.createCoupon({
  name: "coupon",
});
```

---

## `.getCoupons([options])`

Get all coupons.

**Parameters**

| Name                            | Type                          | Default          | Description                                                                                                                        |
| ------------------------------- | ----------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `options.limit`                 | `number`                      | `10`             | The maximum number of coupons to return.                                                                                            |
| `options.page`                  | `number`                      | `1`              | The page of coupons to return.                                                                                                      |
| `options.sortBy`                | [`sort`](./Filtering#Sorting) | `createdAt:DESC` | The field(s) to sort the coupons by. Can be `createdAt` or `name`                |
| `options.filter.name`           | `string` \| `string[]`        | `undefined`      | The name(s) of the coupon(s) to filter   |

**Returns: [`Promise<PaginatedResponse<Order>>`](./Order)**

**Example**

```js
const coupons = await client.getCoupons({
  limit: 20,
  page: 1,
  sortBy: "createdAt:ASC",
  filter: {
    name: "test",
  },
});
```

---

## `.getCoupon(id)`

Get a coupon by its ID.

**Parameters**

| Name | Type     | Description                  |
| ---- | -------- | ---------------------------- |
| `id` | `string` | The ID of the coupon to get. |

**Returns: [`Promise<Coupon>`](./Coupon)**

**Example**

```js
const coupon = await client.getCoupon("example-coupon-id");
```

---