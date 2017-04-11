# typed-bitwig-api

Typescript types definition file for Bitwig Control Surface API.


## Installation

```bash
$ npm install typed-bitwig-api
```

In your `tsconfig.json` for your project add the following to the `types` list:

```js
{
    ...
    "types": [
        ...,
        "typed-bitwig-api"
    ],
    ...
}
```


## Usage

With the above installation complete, the `host` variable should be seen as available globally (along with `load`, `loadAPI`, `println`, `dump`, etc). API interfaces are made available for reference through the globally accessible `API` namespace. So, for example, if you wrote a function that took an instance of the API's `Transport` object, you would reference it as follows:

```ts
function foo(transport: API.Transport) {
    // ... do something
}
```
