Contains information about Templates and methods to make previews.

# Fields

| Name             | Type                             | Description                                                                                             |
|------------------|----------------------------------|---------------------------------------------------------------------------------------------------------|
| `id`             | `string`                         | The ID of the template.                                                                                 |
| `name`           | `string`                         | The name of the template.                                                                               |
| `format`         | `string`                         | The format of the template. Can be `POSTCARD_A5`, `POSTCARD_A6`, `POSTCARD_SQ14` or `GREETINGCARD_SQ15` |
| `labels`         | `string[]`                       | The labels of the template.                                                                             |
| `mergeVariables` | `string[]`                       | The merge variables of the template.                                                                    |
| `thumbnail`      | `string`                         | The thumbnail of the template in base64.                                                                |
| `apiVersion`     | `string`                         | The API version of the template.                                                                        |
| `version`        | `number`                         | The version of the template.                                                                            |
| `updatedAt`      | `Date`                           | The date and time the template was last updated.                                                        |
| `pages`          | [`Page[]`](#Page) \| `undefined` | The pages of the template. Is `undefined` if the template is not [loaded](#load).                       |

# Methods

## `.load()`

Load the pages of the template.

**Returns: `Promise<void>`**

**Example**

```js
await template.load();

console.log(template.pages);
```

---

## `.preview([mergeVariables])`

Make a preview of the template.

**Parameters**

| Name             | Type     | Description                                                                                  |
|------------------|----------|----------------------------------------------------------------------------------------------|
| `mergeVariables` | `object` | The merge variables to use in the preview. Is an object with the merge variable name as key. |

**Returns: [`Promise<Preview>`](./Preview)**

**Example**

```js
const previews = await template.preview({
  name: "John Doe",
  address: "Main Street 1"
});
```

---

## `.delete()`

Delete the template.

**Returns: `Promise<void>`**

**Example**

```js
await template.delete();
```

---

## [`PrintOne.getTemplates([options])`](./PrintOne#gettemplatesoptions)

Get all templates.

**Parameters**

| Name                    | Type                               | Default          | Description                                                                                                                |
|-------------------------|------------------------------------|------------------|----------------------------------------------------------------------------------------------------------------------------|
| `options.limit`         | `number`                           | `10`             | The maximum number of templates to return.                                                                                 |
| `options.page`          | `number`                           | `1`              | The page of templates to return.                                                                                           |
| `options.sortBy`        | [`sort`](./Filtering#Sorting)      | `updatedAt:DESC` | The field(s) to sort the templates by. Can be `updatedAt`                                                                  |
| `options.filter.name`   | `string` \| `string[]`             | `undefined`      | The name(s) of the template(s) to filter by.                                                                               |
| `options.filter.labels` | [`contains`](./Filtering#Contains) | `undefined`      | The label(s) of the template(s) to filter by.                                                                              |
| `options.filter.format` | `string` \| `string[]`             | `undefined`      | The format(s) of the template(s) to filter by. Can be `POSTCARD_A5`, `POSTCARD_A6`, `POSTCARD_SQ14` or `GREETINGCARD_SQ15` |

**Returns: [`Promise<Template[]>`](./Template)**

**Example**

```js
const templates = await client.getTemplates({
  limit: 20,
  page: 1,
  sortBy: "updatedAt:ASC",
  filter: {
    name: "Example Template",
    labels: "example",
    format: Format.POSTCARD_A5
  }
});
```

---

## [`PrintOne.getTemplate(id)`](./PrintOne#gettemplateid)

Get a template by its ID.

**Parameters**

| Name | Type     | Description                    |
|------|----------|--------------------------------|
| `id` | `string` | The ID of the template to get. |

**Returns: [`Promise<Template>`](./Template)**

**Example**

```js
const template = await client.getTemplate("example-template-id");
```

---

## [`Order.getTemplate()`](./Order#gettemplate)

Get the template of the order.

**Returns: [`Promise<Template>`](./Template)**

**Example**

```js
const template = await order.getTemplate();
```

# Interfaces

## `Page`

Contains information about a page.

### Fields

| Name          | Type     | Description                   |
|---------------|----------|-------------------------------|
| `orderingKey` | `string` | The ordering key of the page. |
| `content`     | `string` | The content of the page.      |


