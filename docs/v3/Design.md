Contains information about Campaign Design. There are two types; Compact Design and Full Design (includes pages and helper calls).

# Fields

## Compact Design

| Name             | Type      | Description                                                                                            |
| ---------------- | --------- | ------------------------------------------------------------------------------------------------------ |
| `id`             | `string`  | Design ID (e.g., `tmpl_1234567890`).                                                                   |
| `version`        | `number`  | The version of the design. This is incremented every time the design is updated.                       |
| `name`           | `string`  | Design name. Must be between 1 and 255 characters.                                                     |
| `format`         | `string`  | Design format/product (e.g., `POSTCARD_SQ15`).                                                         |
| `labels`         | `array`   | The labels that are attached to this design (e.g., `["Greeting Card", "Happy"]`).                      |
| `mergeVariables` | `array`   | The merge variables that are used in this design (e.g., `["name"]`).                                   |
| `thumbnail`      | `string`  | (Optional) The thumbnail that represents the first page of the design (base64 encoded). Can be `null`. |
| `apiVersion`     | `number`  | The API version the design was created with.                                                           |
| `updatedAt`      | `Date`    | Timestamp of when the design was last updated.                                                         |
| `campaignId`     | `string`  | The ID of the campaign this design belongs to.                                                         |
| `destination`    | `string`  | The destination for the design (e.g., `NETHERLANDS`, `GERMANY`, `INTERNATIONAL`).                      |
| `default`        | `boolean` | Whether this design is the default design for its destination in the campaign.                         |

## Full Design

In addition to the [Compact Design](#compact-design) fields, Full Design has these fields too which can be [loaded](#load). Accessing these fields before loading will throw an error.

| Name                    | Type                      | Description                                 |
| ----------------------- | ------------------------- | ------------------------------------------- |
| `pages`                 | `DesignPage[]`            | The pages that are attached to this design. |
| `serializedHelperCalls` | `Record<string, unknown>` | Serialized helper calls used in the design. |

### Design Page

| Name           | Type     | Description                                                               |
| -------------- | -------- | ------------------------------------------------------------------------- |
| `content`      | `string` | The content of the page.                                                  |
| `friendlyName` | `string` | The friendly name of the page (e.g., "Front"/ "Inside").                  |
| `orderingKey`  | `number` | The ordering key of the page (e.g., 0 for first page, 1 for second page). |

# Methods

## `.makeDefault()`

Make this design the default design for its destination in the campaign. This will demote any other default designs for the same destination.

## `.load()`

Load the full design data, including pages and helper calls.
