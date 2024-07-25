Contains all information about a given CsvOrder

# Fields

| Name                   | Type                                 | Description                                                                       |
| ---------------------- | ------------------------------------ | --------------------------------------------------------------------------------- |
| `id`                   | `string`                             | The ID of the coupon code.                                                        |
| `couponId`             | `string`                             | The ID of the parent coupon.                                                      |
| `code`                 | `string`                             | The actual code saved for the coupon code`.                                       |
| `used`                 | `boolean`                            | Whether the coupon code has been used.                                            |
| `usedAt`               | `Date` or `null`                     | The date at which the coupon code was used or `null` if not used yet.             |
| `orderId`              | `string` or `null`                   | The order ID by which the coupon code was used or `null` if not used yet.         |

# Methods
---

## `.refresh()`

Refresh the CouponCode data to get the latest information

**Returns: `Promise<void>`**

**Example**

```js
const couponCode: CouponCOde;
await couponCode.refresh();
```

---

## `.getOrder()`

Get the order the coupon code was used by. You might need to do [`CouponCode.refresh`](#refresh) first when coupon was used after fetching.

**Returns: [`Promise<Order|null>`](./Order)**

**Example**

```js
const couponCode: CouponCode
const order = await couponCode.getOrder();;
```
