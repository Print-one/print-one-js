# Print-one.js

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Issues][issues-img]][issues-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

[npm-img]:https://img.shields.io/npm/v/@print-one/print-one-js
[npm-url]:https://www.npmjs.com/package/@print-one/print-one-js

[build-img]:https://github.com/Print-one/print-one-js/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/Print-one/print-one-js/actions/workflows/release.yml

[issues-img]:https://img.shields.io/github/issues/Print-one/print-one-js/bug
[issues-url]:https://github.com/Print-one/print-one-js/issues

[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release

> The official javascript client for [Print.one](https://print.one)

## Installation

```bash
npm install @print-one/print-one-js
```

## Example

```js
import { PrintOne } from '@print-one/print-one-js'

const client = new PrintOne("<YOUR API TOKEN>");

const templates = await client.getTemplates();
const template = templates[0];

const order = await client.createOrder({
    recipient: {
        name: "John Doe",
        address: "Example Street 2",
        city: "Anytown",
        postalCode: "1234AB",
        country: "NL",
    },
    template: template,
    // All other options are optional
    sender: {
        name: "Jane Doe",
        address: "Example Street 1",
        addressLine2: "Apt 1",
        city: "Anytown",
        postalCode: "1234AB",
        country: "NL",
    },
    finish: Finish.GLOSSY,
    mergeVariables: {
        couponCode: "ABC123"
    },
    billingId: "8073",
    sendDate: "2021-01-01",
});

const download = await order.download();

fs.writeFileSync("order.pdf", download);
```

## Help

- For documentation and more examples, see the [documentation](https://github.com/Print-one/print-one-js/wiki).
- With problems, questions or suggestions, please file an [issue](https://github.com/Print-one/print-one-js/issues).
- For other questions, feel free to contact us at [our support page](https://printone.atlassian.net/servicedesk/customer/portals).


