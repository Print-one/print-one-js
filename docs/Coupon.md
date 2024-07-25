Contains all information about a given CsvOrder

# Fields

| Name                   | Type                                 | Description                                                                                              |
| ---------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `id`                   | `string`                             | The ID of the coupon.                                                                                    |
| `name`                 | `string`                             | The name of the coupon.                                                                                  |
| `companyId`            | `string`                             | The ID of the company the coupon belongs to.                                                             |
| `stats`                | `object`                             | An object containing the stats of the coupon. With keys 'total', 'used' and 'remaining'                  |

# Methods

## `.refresh()`

Refresh the Coupon data to get the latest information

**Returns: `Promise<void>`**

**Example**

```js
const coupon: Coupon;
await coupon.refresh();
```

---

## `Coupon.getCodes()`

Get all coupon codes within the coupon.                                                                                    |

**Returns: [`Promise<PaginatedResponse<CouponCode>>`](./CouponCode)**

**Example**

```js
const couponCodes = await coupon.getCodes();
```

---

## `Coupon.getCode(id)`

Get all coupon codes by its ID.     

**Parameters**

| Name | Type     | Description                       |
| ---- | -------- | --------------------------------- |
| `id` | `string` | The ID of the coupon code to get. |

**Returns: [`Promise<PaginatedResponse<CouponCode>>`](./CouponCode)**

**Example**

```js
const couponCode = await coupon.getCode('example-coupon-code-id');
```

---

## `Coupon.addCodes(csv)`

Add coupon codes to the coupon by uploading a CSV.

**Parameters**

| Name       | Type          | Description                       |
| ---------- | ------------- | --------------------------------- |
| `csv`      | `ArrayBuffer` | The file to upload. Must be a CSV |

**Returns: `Promise<void>`

**Example**

```js
const data = fs.readFileSync("example.csv").buffer;
const file = await coupon.addCodes(data);
```


---

## `Coupon.delete()`

Delete the coupon.

**Returns: `Promise<void>`

**Example**

```js
await coupon.delete();
```

