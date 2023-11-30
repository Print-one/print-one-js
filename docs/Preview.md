Contains references to where to download or get details.

# Fields

| Name          | Type     | Description                                    |
| ------------- | -------- | ---------------------------------------------- |
| `orderingKey` | `string` | The number of which page of the order this is. |
| `url`         | `string` | The URL to download the page.                  |
| `detailsUrl`  | `string` | The URL to get details about the page.         |

# Methods

## `.download([polling], [timeout])`

Download the page.

**Parameters**

| Name      | Type      | Default | Description                                                                         |
| --------- | --------- | ------- | ----------------------------------------------------------------------------------- |
| `polling` | `boolean` | `true`  | Whether to poll the API until the page is ready to download.                        |
| `timeout` | `number`  | `20`    | The maximum amount of time in seconds to wait for the page to be ready to download. |

**Returns: `Promise<ArrayBuffer>`**

**Example**

```js
const template = await client.getTemplate("example-template-id");
const preview = await template.getPreview();

const download = await preview[0].download();
```

---

## `.getDetails([polling], [timeout])`

Get details about the page.

**Parameters**

| Name      | Type      | Default | Description                                                                         |
| --------- | --------- | ------- | ----------------------------------------------------------------------------------- |
| `polling` | `boolean` | `true`  | Whether to poll the API until the page is ready to download.                        |
| `timeout` | `number`  | `20`    | The maximum amount of time in seconds to wait for the page to be ready to download. |

**Returns: [`Promise<PreviewDetails>`](./PreviewDetails)**

**Example**

```js
const template = await client.getTemplate("example-template-id");
const preview = await template.getPreview();

const details = await preview[0].getDetails();
```

---

## [`Template.preview([mergeVariables])](./Template#previewmergevariables)`

Make a preview of the template.

**Parameters**

| Name             | Type     | Description                                                                                  |
| ---------------- | -------- | -------------------------------------------------------------------------------------------- |
| `mergeVariables` | `object` | The merge variables to use in the preview. Is an object with the merge variable name as key. |

**Returns: [`Promise<Preview>`](./Preview)**

**Example**

```js
const previews = await template.preview({
  name: "John Doe",
  address: "Main Street 1",
});
```
