Contains information about a Campaign.

# Fields

## Campaign

| Name             | Type     | Description                                                                                           |
| ---------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `id`             | `string` | The ID of the campaign (e.g., `cmp_123456789`).                                                       |
| `identifier`     | `string` | Custom ID for the campaign (e.g., `my-custom-id`).                                                    |
| `name`           | `string` | The name of the campaign (e.g., `Welcome Back`).                                                      |
| `description`    | `string` | The description of the campaign. Can be `null`.                                                       |
| `meta`           | `object` | Additional metadata for the campaign. Can be `null`.                                                  |
| `mergeVariables` | `array`  | A list of all merge variables in the campaign (e.g., `["firstName", "lastName"]`).                    |
| `scheduleType`   | `string` | The type of schedule for the campaign. See [CampaignScheduleType](/src/enums/CampaignScheduleType.ts) |
| `stampId`        | `string` | The default postal stamp for the campaign (e.g., `stmp_123456789`). Can be `null`.                    |
| `sender`         | `object` | The default return address for the campaign (Address object). Can be `null`.                          |
| `billingId`      | `string` | The billing ID used for the campaign (e.g., `sector-a`). Can be `null`.                               |
| `status`         | `string` | The status of the campaign. See [CampaignStatus](/src/enums/CampaignStatus.ts).                       |
| `npdrCategory`   | `string` | (Optional) The Postfilter.nl category for the campaign (e.g., `WEBSHOPS`). Requires feature flag.     |
| `createdAt`      | `Date`   | The date at which the campaign was created (ISO 8601 format).                                         |
| `updatedAt`      | `Date`   | The date at which the campaign was last updated (ISO 8601 format).                                    |
| `destinations`   | `array`  | List of destinations for the campaign. See [Destination Docs](./Destination.md).                      |
| `designs`        | `array`  | List of designs within the campaign. Load via [Campaign.loadDesigns()](#campaign.loaddesigns).        |

## Update Campaign

| Name           | Type     | Description                                             |
| -------------- | -------- | ------------------------------------------------------- |
| `name`         | `string` | The name of the campaign.                               |
| `sender`       | `object` | The default return address for the campaign.            |
| `ndprCategory` | `string` | (Optional) The Postfilter.nl category for the campaign. |
| `meta`         | `object` | Additional metadata for the campaign.                   |

## Campaign Counts

| Name           | Type                                     | Description                                                                                     |
| -------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `total`        | `number`                                 | Total number of orders for the campaign.                                                        |
| `destinations` | `Record<Destination, DestinationCounts>` | Object with destination codes as keys and counts. See [Destination Counts](#destination-counts) |

### Destination Counts

| Name        | Type     | Description                                   |
| ----------- | -------- | --------------------------------------------- |
| `draft`     | `number` | Number of draft orders, regardless of status. |
| `next`      | `number` | Number of orders in the next shipment.        |
| `scheduled` | `number` | Number of orders scheduled for the future.    |
| `sent`      | `number` | Number of orders sent in the past.            |
| `failed`    | `number` | Number of orders that failed.                 |
| `cancelled` | `number` | Number of orders that were cancelled.         |
| `total`     | `number` | Total number of orders for the destination.   |

# Methods

## Campaign.loadDesigns()

Load all designs associated with the campaign. Access via `campaign.designs`.

## Campaign.addVariablesFallback()

Add variable fallbacks to the campaign's destinations. This will overwrite existing fallbacks, so be sure to include all desired fallbacks for all destinations. Set a destination to null to remove all fallbacks for that destination and halt any orders. Set any variable to an empty string to leave it empty, but continue processing the order.

It accepts a single parameter:

- `fallbacks: Record<string, Record<string, string>>` - An object where keys are destination codes and values are objects mapping variable names to their fallback values.

All variables used in the campaign are accessible via `campaign.mergeVariables`.

## Campaign.pause()

Pause the campaign. This will stop any orders from being sent until the campaign is resumed. Orders are still accepted while the campaign is paused.

## Campaign.resume()

Resume a paused campaign. Orders will start being sent again.

## Campaign.refresh()

Refresh the campaign data from the API. Useful if you suspect the local data is outdated.
