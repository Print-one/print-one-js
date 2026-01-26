Contains information about Campaign Destination. There are two types of destination; Continuous and One-off. One-off has additional fields to schedule the mailing.

# Fields

## Continuous

| Name                | Type     | Description                                                                                                                              |
| ------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `destination`       | `string` | Destination for the campaign. See [Destination](/src/enums/Destination.ts)                                                               |
| `threshold`         | `number` | The threshold for the destination, which determines the minimum number of orders required to trigger the delivery. Minimum value is `1`. |
| `product`           | `string` | The product used for this destination. See [Format](/src/enums/Format.ts)                                                                |
| `finish`            | `string` | The finish type for the product used in this destination. See [Finish](/src/enums/Finish.ts)                                             |
| `designId`          | `string` | (Optional) The ID of an existing design used for this destination.                                                                       |
| `variablesFallback` | `object` | (Optional) Personalization data fallback values. Can contain string, number, or boolean values.                                          |

## One-off

In addition of the [Continuous](#Continuous) fields, One-off has these fields too.

| Name               | Type      | Description                                                                                        |
| ------------------ | --------- | -------------------------------------------------------------------------------------------------- |
| `deliveryWeekIso`  | `number`  | The ISO week number for the delivery of the destination.                                           |
| `deliveryWeekYear` | `number`  | The ISO year number for the delivery of the destination.                                           |
| `asapFallback`     | `boolean` | (Optional) Whether the campaign should fall back to ASAP delivery if economy threshold is not met. |
