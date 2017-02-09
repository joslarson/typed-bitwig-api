# bitwig-api-ts-stubs

Typescript types definition file for Bitwig Control Surface API.


## Installation

```bash
$ npm install bitwig-api-ts-stubs
```

In your `tsconfig.json` for your project add the following to the `include` list:

```js
{
    ...
    "include": [
        ...,
        "node_modules/bitwig-api-ts-stubs/bitwig-api.d.ts"
    ],
    ...
}
```

> Note: Make sure your exclude patterns aren't excluding the entire `node_modules` directory, as this seems to negate the include.


## Usage

With the above installation complete, the `host` variable should be seen as available globally (along with `load`, `loadAPI`, `println`, `dump`, etc). API interfaces are made available for reference through the globally accessible `API` namespace. So, for example, if you wrote a function that took an instance of the API's `Transport` object, you would reference it as follows:

```ts
function foo(transport: API.Transport) {
    // ... do something
}
```
