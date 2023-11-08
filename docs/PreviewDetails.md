Contains details about a preview, such as the errors if the preview generated those.

# Fields

| Name       | Type       | Description                |
|------------|------------|----------------------------|
| `id`       | `string`   | The ID of the preview.     |
| `errors`   | `string[]` | The errors of the preview. |
| `imageURL` | `string`   | The URL to the preview.    |

# Methods

## `.download()`

Download the preview.

**Returns: `Promise<ArrayBuffer>`**

**Example**

```js
const template = await client.getTemplate("example-template-id");
const preview = await template.getPreview();
const details = await preview[0].getDetails();

const download = await details.download();
```

---

## [`Preview.getDetails([polling], [timeout])`](./Preview#getdetailspolling-timeout)

Get details about the page.

**Parameters**

| Name       | Type      | Default | Description                                                                         |
|------------|-----------|---------|-------------------------------------------------------------------------------------|
| `polling`  | `boolean` | `true`  | Whether to poll the API until the page is ready to download.                        |
| `timeout`  | `number`  | `20`    | The maximum amount of time in seconds to wait for the page to be ready to download. |

**Returns: [`Promise<PreviewDetails>`](./PreviewDetails)**

**Example**

```js
const template = await client.getTemplate("example-template-id");
const preview = await template.getPreview();

const details = await preview[0].getDetails();
```
