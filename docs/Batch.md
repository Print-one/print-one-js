Contains all information about a given Batch

# Fields

| Name             | Type                    | Description                                                                                                                                                                   |
| ---------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`             | `string`                | The ID of the batch.                                                                                                                                                          |
| `companyId`      | `string`                | The ID of the company the batch belongs to.                                                                                                                                   |
| `Name`           | `string`                | The name of the batch.                                                                                                                                                        |
| `billingId`      | `string` \| `undefined` | The ID assigned to the batch by the customer.                                                                                                                                 |
| `finish`         | `string`                | The finish of the batch. Can be `GLOSSY` or `MATT`.                                                                                                                           |
| `isBillable`     | `boolean`               | Whether the batch is billable. True when an live API key is used, false when a test API key is used.                                                                          |
| `templateId`     | `string`                | The ID of the template the batch is based on.                                                                                                                                 |
| `estimatedPrice` | `number`                | The estimated price of the batch.                                                                                                                                             |
| `status`         | `string`                | The status of the batch. Can be `batch_created`, `batch_needs_approval`, `batch_user_ready`, `batch_ready_to_schedule`, `batch_scheduling`, `batch_scheduled` or `batch_sent` |
| `orders`         | `object`                | An object containing the orders of the batch. With keys 'processing', 'success', 'failed' and 'cancelled'                                                                     |
| `createdAt`      | `string`                | The date the batch was created.                                                                                                                                               |
| `updatedAt`      | `string`                | The date the batch was last updated.                                                                                                                                          |

# Methods

## `.getTemplate()`

Get the template the batch is based on. Uses [`PrintOne.getTemplate()`](./PrintOne#gettemplateid).

**Returns: [`Promise<Template>`](./Template)**

**Example**

```js
const batch = await client.getbatch("example-batch-id");
const template = await batch.getTemplate();
```

---

## `.refresh()`

Refresh the batch data to get the latest information

**Returns: `Promise<void>`**

**Example**

```js
const batch: Batch;
await batch.refresh();
```

---

## [`.getOrders([options])`](./PrintOne#getordersoptions)

Get all orders in the batch.

**Parameters**

| Name                            | Type                          | Default          | Description                                                                                                                        |
| ------------------------------- | ----------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `options.limit`                 | `number`                      | `10`             | The maximum number of batchs to return.                                                                                            |
| `options.page`                  | `number`                      | `1`              | The page of batchs to return.                                                                                                      |
| `options.sortBy`                | [`sort`](./Filtering#Sorting) | `createdAt:DESC` | The field(s) to sort the batchs by. Can be `createdAt`, `anonymizedAt`, `updatedAt`, `friendlyStatus` or `sendDate`                |
| `options.filter.friendlyStatus` | `string` \| `string[]`        | `undefined`      | The friendly status(es) of the batch(s) to filter by. Can be `Processing`, `Success`, `Sent`, `Scheduled`, `Cancelled` or `Failed` |
| `options.filter.billingId`      | `string` \| `string[]`        | `undefined`      | The billing ID(s) of the batch(s) to filter by.                                                                                    |
| `options.filter.format`         | `string` \| `string[]`        | `undefined`      | The format(s) of the batch(s) to filter by. Can be `POSTCARD_A5`, `POSTCARD_A6`, `POSTCARD_SQ14` or `GREETINGCARD_SQ15`            |
| `options.filter.finish`         | `string` \| `string[]`        | `undefined`      | The finish(es) of the batch(s) to filter by. Can be `GLOSSY` or `MATTE`                                                            |
| `options.filter.isBillable`     | `boolean`                     | `undefined`      | Whether the batch(s) are live batch or test batchs.                                                                                |
| `options.filter.createdAt`      | [`date`](./Filtering#Date)    | `undefined`      | The date(s) the batch(s) were created on.                                                                                          |

**Returns: [`Promise<PaginatedResponse<Order>>`](./Order)**

**Example**

```js
const orders = await batch.getOrders({
  limit: 20,
  page: 1,
  sortBy: "createdAt:ASC",
  filter: {
    friendlyStatus: "Success",
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

## [`.getOrder(orderId)`](./PrintOne#getorderorderid)

Get a specific order in the batch.

**Parameters**

| Name      | Type     | Description          |
| --------- | -------- | -------------------- |
| `orderId` | `string` | The ID of the order. |

**Returns: [`Promise<Order>`](./Order)**

**Example**

```js
const order = await batch.getOrder("example-order-id");
```

---

## `.createOrder(data)`

Create a new order in the batch.

**Parameters**

| Name             | Type                         | Description                       |
| ---------------- | ---------------------------- | --------------------------------- |
| `data.recipient` | [`Address`](./Order#Address) | The recipient of the order.       |
| `mergeVariables` | `object`                     | The merge variables of the order. |

**Returns: [`Promise<Order>`](./Order)**

**Example**

```js
const order = await batch.createOrder({
  recipient: {
    name: "John Doe",
    address: "123 Main St",
    city: "Anytown",
    postalCode: "1221AH",
    country: "Nederland",
  },
  mergeVariables: {
    name: "John Doe",
  },
});
```

---

## `.update(data)`

Update the batch.

**Parameters**

| Name         | Type                | Description                                 |
| ------------ | ------------------- | ------------------------------------------- |
| `data.ready` | `Date` \| `boolean` | Whether the batch is ready to be scheduled. |

**Returns: `Promise<void>`**

**Example**

```js
await batch.update({
  ready: true,
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
const batch: Batch;

const order = await batch.createCsvOrder({
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
const batch: Batch;

const csvOrder = await batch.getCsvOrder("example-order-id");
```
