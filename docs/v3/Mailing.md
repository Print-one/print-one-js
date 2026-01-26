Contains information about a campaign mailing.

# Fields

## Mailing

| Name              | Type          | Description                                                     |
| ----------------- | ------------- | --------------------------------------------------------------- |
| `id`              | `string`      | Mailing identifier (e.g. `mail_123`).                           |
| `status`          | `string`      | Mailing status (e.g. `MAILING_SENT`).                           |
| `createdAt`       | `Date`        | Creation timestamp.                                             |
| `destination`     | `Destination` | Destination code. See [Destination](/src/enums/Destination.ts). |
| `format`          | `Format`      | Product format. See [Format](/src/enums/Format.ts).             |
| `finish`          | `Finish`      | Finish type. See [Finish](/src/enums/Finish.ts).                |
| `orderPageCount`  | `number`      | Total page count across orders.                                 |
| `orderCount`      | `number`      | Total number of orders in the mailing.                          |
| `templateId`      | `string`      | Template identifier used for the mailing.                       |
| `overlay`         | `string`      | Overlay identifier.                                             |
| `printingHouseId` | `string`      | Printing house identifier.                                      |
| `deliveryType`    | `string`      | Delivery type (e.g. `DRIP`).                                    |
| `costs`           | `object`      | Cost breakdown. See [Costs](#costs).                            |

## Costs

All cost amounts are in eurocents.

| Name       | Type     | Description     |
| ---------- | -------- | --------------- |
| `total`    | `number` | Total amount    |
| `subtotal` | `number` | Subtotal amount |
| `tax`      | `number` | Tax amount      |
