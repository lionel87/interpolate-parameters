# String interpolation on configuration parameters
While iterating trough on an object or array, it replaces placeholders with values from a given set. Additionally, if a placeholder perfectly matches (read: no other characters before and after are present) the actual value will be returned as-is, without transforming it to a string.

## Installation
```
npm install --save interpolate-parameters
```

## Usage
```js
const interpolate = require("interpolate-parameters");

const messages = {
    userName: "%name%",
    greetings: "Hello %name.first%!"
};
const data = { name: { first: "John", last: "Doe" }};

const result = interpolate(messages, data);

console.log(result); // { userName: { first: "John", last: "Doe" }, greetings: "Hello John!" }
console.log(messages); // { userName: "%name%", greetings: "Hello %name.first%!" }
```

Alternatively you can also specify a pattern for the replacement format:

```js
const interpolate = require("interpolate-parameters");

const messages = {
    userName: "${name}",
    greetings: "Hello ${name.first}!"
};
const pattern = /\$\{(.+?)\}/g;
const data = { name: { first: "John", last: "Doe" }};

const result = interpolate(messages, data, pattern);

console.log(result); // { userName: { first: "John", last: "Doe" }, greetings: "Hello John!" }
console.log(messages); // { userName: "${name}", greetings: "Hello ${name.first}!" }
```

Interpolation also works on nested objects, arrays and strings:

```js
const interpolate = require("interpolate-parameters");


const messages = {
    userName: "%name%",
    greetings: {
        en: "Hello %name.first%!",
        fr: "Bonjour %name.first%!"
    }
};
const messages_array = [
    "%name%",
    "Hello %name.first%!"
];
const data = { name: { first: "John", last: "Doe" }};

const nested = interpolate(messages, data);
const array = interpolate(messages_array, data);
const string = interpolate(messages_array[0], data);

console.log(nested);
// {
//   userName: { first: "John", last: "Doe" },
//   greetings: { en: "Hello John!", fr: "Bonjour John!" }
// }

console.log(array); // [ { first: "John", last: "Doe" }, "Hello John!" ]
console.log(string); // "Hello John!"
console.log(messages_array); // [ "%name%", "Hello %name.first%!" ]
```

### Notes
 - As seen in the example above, the original `messages` object will not be modified. Everytime a new copy will be returned.

### Todo
 - Implement tests.
