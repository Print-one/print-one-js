# Sorting

The sorting options for the API. Are defined using the following format:

```js
const sortBy = "<field>:<order>";
```

Or:

```js
const sortBy = {
  order: "<order>",
  field: "<field>",
};
```

Where `<field>` is the field to sort by and `<order>` is the order to sort in.
It can also be an array of the above formats.

## Examples

```js
// Simplest form
const sortBy = "<field>:ASC";
const sortBy = "<field>:DESC";
```

```js
// Multiple fields
const sortBy = ["<field1>:ASC", "<field2>:DESC"];
```

```js
// Object form
const sortBy = {
  order: "ASC",
  field: "<field>",
};
```

```js
// Multiple fields in object form
const sortBy = [
  {
    order: "ASC",
    field: "<field1>",
  },
  {
    order: "DESC",
    field: "<field2>",
  },
];
```

# Filtering

## Contains

Filtering a field which is a list of strings can be done using the `contains` filter. It is defined using the following format:

```js
const contains = "<value>";
```

Or if all field values must be contained:

```js
const contains = {
  all: ["<value1>", "<value2>"],
};
```

Or if any field value must be contained:

```js
const contains = {
  some: ["<value1>", "<value2>"],
};
```

Where `<value>` is the value to filter by.

## Date

Filtering a field which is a date can be done using the `date` filter. It is defined using the following format:

```js
const date = {
  from?: "<date>",
  to?: "<date>"
};
```

Where `<date>` is the date to filter by.

## Examples

```js
// Between two dates
const filter = {
  date: {
    from: "2019-01-01",
    to: "2019-12-31",
  },
};
```

```js
// After a date
const filter = {
  date: {
    from: "2019-01-01",
  },
};
```

```js
// Before a date
const filter = {
  date: {
    to: "2019-12-31",
  },
};
```
