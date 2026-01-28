The main class of the library. It is used to create a client for the Print.one API.

This page documents **only the methods that use v3 endpoints** (i.e. methods that call `v3Client.*` in `PrintOne.ts`).

# Constructor (v3)

```js
import { PrintOne } from "@print-one/print-one-js";

const client = new PrintOne(apiKey, { version: "v3" });
```

# Properties

## `.v3Client`

Access to the underlying HTTP handler configured for API **v3**.

> Note: `client.v3Client` throws if the client was not initialized with `{ version: "v3" }`.

---

# Methods (v3)

## `.getCampaigns([options])`

Get all campaigns.

**Parameters**

| Name             | Type                           | Default          | Description                                                                                                       |
| ---------------- | ------------------------------ | ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| `options.limit`  | `number`                       | `10`             | The maximum number of campaigns to return.                                                                        |
| `options.page`   | `number`                       | `1`              | The page of campaigns to return.                                                                                  |
| `options.sortBy` | [`sort`](../Filtering#Sorting) | `createdAt:DESC` | The field(s) to sort campaigns by. Can be `createdAt`, `updatedAt`, `archivedAt`, `name`, `identifier`, `status`. |

**Returns:** `Promise<PaginatedResponseV3<Campaign>>`

**Example**

```js
const campaigns = await client.getCampaigns({
  limit: 20,
  page: 1,
  sortBy: "createdAt:DESC",
});
```

---

## `.getCampaign(id)`

Get a campaign by its identifier.

**Parameters**

| Name | Type     | Description                           |
| ---- | -------- | ------------------------------------- |
| `id` | `string` | The id or identifier of the campaign. |

**Returns:** `Promise<Campaign>`

**Example**

```js
const campaign = await client.getCampaign("cmp_123");
```

---

## `.updateCampaign(campaignId, data)`

Update a campaign.

**Parameters**

| Name         | Type             | Description                       |
| ------------ | ---------------- | --------------------------------- |
| `campaignId` | `string`         | Campaign identifier.              |
| `data`       | `UpdateCampaign` | Fields to update on the campaign. |

[`UpdateCampaign`](./Campaign.md#update-campaign) supports (as sent to the API): `name`, `sender`, `npdrCategory`, `meta`.

**Returns:** `Promise<Campaign>`

**Example**

```js
const updated = await client.updateCampaign("cmp_123", {
  name: "Spring campaign",
  meta: { source: "crm" },
});
```

---

## `.getCampaignCounts(id)`

Get destination counts for a campaign.

**Parameters**

| Name | Type     | Description                     |
| ---- | -------- | ------------------------------- |
| `id` | `string` | The identifier of the campaign. |

**Returns:** `Promise<CampaignCounts>`

**Example**

```js
const counts = await client.getCampaignCounts("cmp_123");
```

---

## `.getCampaignDesigns(campaignId, [options])`

Get all designs for a campaign.

**Parameters**

| Name             | Type                           | Default    | Description                                                                      |
| ---------------- | ------------------------------ | ---------- | -------------------------------------------------------------------------------- |
| `campaignId`     | `string`                       | —          | The identifier of the campaign.                                                  |
| `options.limit`  | `number`                       | `10`       | The maximum number of designs to return.                                         |
| `options.page`   | `number`                       | `1`        | The page of designs to return.                                                   |
| `options.sortBy` | [`sort`](../Filtering#Sorting) | `name:ASC` | The field(s) to sort designs by. Can be `name`, `labels`, `format`, `deletedAt`. |

**Returns:** `Promise<PaginatedResponseV3<Design>>`

**Example**

```js
const designs = await client.getCampaignDesigns("cmp_123", {
  limit: 50,
  page: 1,
  sortBy: "name:ASC",
});
```

---

## `.getCampaignDesign(campaignId, destination, designId)`

Get a design for a campaign destination.

**Parameters**

| Name          | Type          | Description                     |
| ------------- | ------------- | ------------------------------- |
| `campaignId`  | `string`      | The identifier of the campaign. |
| `destination` | `Destination` | The destination of the design.  |
| `designId`    | `string`      | The identifier of the design.   |

**Returns:** `Promise<Design>`

**Example**

```js
import { Destination } from "@print-one/print-one-js";

const design = await client.getCampaignDesign(
  "cmp_123",
  Destination.NETHERLANDS,
  "dsg_456",
);
```

## `.getCampaignMailings(campaignId, [options])`

Get all mailings for a campaign.

**Parameters**

| Name             | Type                           | Default          | Description                                                       |
| ---------------- | ------------------------------ | ---------------- | ----------------------------------------------------------------- |
| `campaignId`     | `string`                       | —                | The identifier of the campaign.                                   |
| `options.limit`  | `number`                       | `10`             | The maximum number of mailings to return.                         |
| `options.page`   | `number`                       | `1`              | The page of mailings to return.                                   |
| `options.sortBy` | [`sort`](../Filtering#Sorting) | `createdAt:DESC` | The field(s) to sort mailings by. Currently supports `createdAt`. |

**Returns:** `Promise<PaginatedResponseV3<Mailing>>`

See [Mailing](./Mailing.md) for the returned item structure.

**Example**

```js
const mailings = await client.getCampaignMailings("cmp_123", {
  limit: 20,
  page: 1,
  sortBy: "createdAt:DESC",
});
```

---

## `.addDesignToDestination(campaignId, destination, data)`

Add a design to a campaign destination.

**Parameters**

| Name          | Type          | Description                           |
| ------------- | ------------- | ------------------------------------- |
| `campaignId`  | `string`      | The identifier of the campaign.       |
| `destination` | `Destination` | The destination to add the design to. |
| `data`        | `AddDesign`   | The design payload to create/upload.  |

**Returns:** `Promise<Design>`

**Example**

```js
import { Destination } from "@print-one/print-one-js";

const design = await client.addDesignToDestination(
  "cmp_123",
  Destination.NETHERLANDS,
  {
    // ...design fields (see Design / AddDesign docs)
  },
);
```

---

## `.deleteDesignFromDestination(campaignId, destination, designId)`

Delete a design from a campaign destination.

**Parameters**

| Name          | Type          | Description                             |
| ------------- | ------------- | --------------------------------------- |
| `campaignId`  | `string`      | The identifier of the campaign.         |
| `destination` | `Destination` | The destination to delete from.         |
| `designId`    | `string`      | The identifier of the design to delete. |

**Returns:** `Promise<void>`

**Example**

```js
import { Destination } from "@print-one/print-one-js";

await client.deleteDesignFromDestination(
  "cmp_123",
  Destination.NETHERLANDS,
  "dsg_456",
);
```
