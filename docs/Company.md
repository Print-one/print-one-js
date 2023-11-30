Contains all information about a given Company

# Fields

| Name                    | Type                  | Description                                       |
| ----------------------- | --------------------- | ------------------------------------------------- |
| `id`                    | `string`              | The ID of the company.                            |
| `firstName`             | `string`              | The first name of the contact person.             |
| `lastName`              | `string`              | The last name of the contact person.              |
| `email`                 | `string`              | The email address of the company.                 |
| `invoiceEmail`          | `string`              | The email address for invoices.                   |
| `financialContactName`  | `string`              | The name of the financial contact.                |
| `finacialContactEmail`  | `string`              | The email address for financial contact.          |
| `technicalContactName`  | `string`              | The name of the technical contact.                |
| `technicalContactEmail` | `string`              | The email address for technical contact.          |
| `phoneNumber`           | `string`              | The phone number of the contact person.           |
| `companyName`           | `string`              | The name of the company.                          |
| `street`                | `string`              | The street of the company.                        |
| `houseNumber`           | `string`              | The house number of the company.                  |
| `country`               | `string`              | The country of the company.                       |
| `postalCode`            | `string`              | The postal code of the company.                   |
| `city`                  | `string`              | The city of the company.                          |
| `cocNumber`             | `string`              | The Chamber of Commerce number.                   |
| `vatNumber`             | `string`              | The VAT number of the company.                    |
| `iban`                  | `string`              | The IBAN number of the company.                   |
| `createdAt`             | `Date`                | The date and time the company was created.        |
| `updatedAt`             | `Date`                | The date and time the company was last updated.   |
| `emailVerifiedAt`       | `Date` \| `undefined` | The date and time the email address was verified. |

# Methods

## [`PrintOne.getSelf()`](./PrintOne#getself)

Get the company that the API key belongs to.

**Returns: [`Promise<Company>`](./Company)**

**Example**

```js
const company = await client.getSelf();
```
