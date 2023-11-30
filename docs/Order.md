Contains all information about a given Order

# Fields

| Name                  | Type                                 | Description                                                                                                                                                             |
| --------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                  | `string`                             | The ID of the order.                                                                                                                                                    |
| `companyId`           | `string`                             | The ID of the company the order belongs to.                                                                                                                             |
| `templateId`          | `string`                             | The ID of the template the order is based on.                                                                                                                           |
| `finish`              | `string`                             | The finish of the order. Can be `GLOSSY` or `MATT`.                                                                                                                     |
| `format`              | `string`                             | The format of the order. Can be `POSTCARD_A5`, `POSTCARD_A6`, `POSTCARD_SQ14` or `GREETINGCARD_SQ15`.                                                                   |
| `mergeVariables`      | `object`                             | The merge variables of the order. Keys are the merge variable names.                                                                                                    |
| `sender`              | [`Address`](#Address) \| `undefined` | The sender of the order.                                                                                                                                                |
| `recipient`           | [`Address`](#Address)                | The recipient of the order.                                                                                                                                             |
| `definitiveCountryId` | `string`                             | The ID of the definitive country of the order.                                                                                                                          |
| `billingId`           | `string` \| `undefined`              | The ID assigned to the order by the customer.                                                                                                                           |
| `isBillable`          | `boolean`                            | Whether the order is billable. True when an live API key is used, false when a test API key is used.                                                                    |
| `status`              | `string`                             | The status of the order. Can be `order_created`, `order_pdf_created`, `order_pdf_queued`, `order_scheduled`, `order_pdf_delivered`, `order_cancelled` or `order_failed` |
| `friendlyStatus`      | `string`                             | The friendly status of the order. Can be `Processing`, `Success`, `Sent`, `Scheduled`, `Cancelled` or `Failed`                                                          |
| `errors`              | `string[]`                           | The errors of the order.                                                                                                                                                |
| `sendDate`            | `Date`                               | The date the order will be sent on.                                                                                                                                     |
| `createdAt`           | `Date`                               | The date and time the order was created.                                                                                                                                |
| `updatedAt`           | `Date`                               | The date and time the order was last updated.                                                                                                                           |
| `anonymizedAt`        | `Date` \| `undefined`                | The date and time the order was anonymized.                                                                                                                             |

# Methods

## `.getTemplate()`

Get the template the order is based on. Uses [`PrintOne.getTemplate()`](./PrintOne#gettemplateid).

**Returns: [`Promise<Template>`](./Template)**

**Example**

```js
const order = await client.getOrder("example-order-id");
const template = await order.getTemplate();
```

---

## `.download([polling], [timeout])`

Download the pdf of the order.

**Parameters**

| Name      | Type      | Default | Description                                                  |
| --------- | --------- | ------- | ------------------------------------------------------------ |
| `polling` | `boolean` | `true`  | Whether to poll the API until the pdf is ready.              |
| `timeout` | `number`  | `20`    | The maximum time in seconds to wait for the pdf to be ready. |

**Returns: `Promise<ArrayBuffer>`**

**Example**

```js
const pdf = await order.download();
```

---

## `.cancel([polling], [timeout])`

Cancel the order. _Only possible when the order is not yet sent and finished processing._

**Parameters**

| Name      | Type      | Default | Description                                                     |
| --------- | --------- | ------- | --------------------------------------------------------------- |
| `polling` | `boolean` | `true`  | Whether to poll the API until the order is finished processing. |
| `timeout` | `number`  | `20`    | The maximum time in seconds to wait for the order to cancel.    |

**Returns: `Promise<void>`**

**Example**

```js
await order.cancel();
```

---

## [`PrintOne.createOrder(data)`](./PrintOne#createorderdata)

Create a new order.

**Parameters**

[//]: # "TODO: Add data description"

| Name   | Type     | Description                                                                          |
| ------ | -------- | ------------------------------------------------------------------------------------ |
| `data` | `object` | The data to create the order with. See [`Order`](./Order#createOrder) for more info. |

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

## [`PrintOne.getOrder(id)`](./PrintOne#getorderid)

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

## [`PrintOne.getOrders([options])`](./PrintOne#getordersoptions)

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

# Interfaces

## `Address`

Contains all information about an address.

### Fields

| Name          | Type     | Description                                 |
| ------------- | -------- | ------------------------------------------- |
| `name`        | `string` | The name of the address.                    |
| `address`     | `string` | The street and house number of the address. |
| `adressLine2` | `string` | The second line of the address.             |
| `city`        | `string` | The city of the address.                    |
| `postalCode`  | `string` | The postal code of the address.             |
| `country`     | `string` | The country of the address.                 |
