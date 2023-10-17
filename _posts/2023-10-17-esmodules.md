---
layout: post
title: "ES modules. Migration of a large codebase"
date: 2023-10-17
tags: ["javascript", "taskcluster"]
---

[Taskcluster](https://github.com/taskcluster/taskcluster) has a large codebase that is written in nodejs and consists of many components: database layer, internal libraries shared among microservices, and services themselves.

They all use shared npm dependencies.

To keep project up-to-date, we use `dependabot`. However, more and more packages switch to ESM-only distributions, which makes it impossible to use in commonjs projects.

ES Modules can import both ESM and CJS modules, but CJS can only import CJS.

## CJS vs ESM

CommonJS modules usually look like this:

```js
// package.json
{
  "main": "index.js"
}

// index.js
const { foo } = require('./foo');
console.log(foo);

// foo.js
exports.foo = 'foo';
```

ESM modules look like this:

```js
// package.json
{
  "type": "module",
  "exports": "./index.js"
}

// index.js
import { foo } from './foo.js';
console.log(foo);

// foo.js
export const foo = 'foo';
```

## Migration

In case of the example above, migration is straightforward:

1. Change or add `"type": "module"` to `package.json`
2. Replace all `const x = require(y)` with `import x from y`
   1. Make sure that files are referenced with `.js` extension: `import x from './y.js'`
   2. In case of folder `import x from './y/index.js'`
3. Replace all `exports.x = y` with `export const x = y`
4. Check possible problems with default vs named exports.
5. Replace `__filename`, `__dirname` with import equivalents
6. Replace dynamic `require(x)` with `await import(x)`
7. Replace `require('./data.json')` with type assertions or `fs.readFile` + `JSON.parse`
8. Replace `module.parent` usage

If you have a larger codebase you could follow my steps from [taskcluster migration](https://github.com/taskcluster/taskcluster/pull/6603) PR.

## Bulk replace all imports

There's a great but abandoned utility [cjs-to-es6](https://github.com/nolanlawson/cjs-to-es6) which would help you to run the initial migration.

```sh
npx cjs-to-es6 ./services
npx cjs-to-es6 ./internal
// etc
```

It would do pretty good job already by replacing all `require` and `exports` with `import` and `export`.

After that you would still need to go through all files and fix remaining issues:

- it doesn't know if imported module is file or folder, so adding `.js` or `/index.js` would be up to you to fix
- it doesn't rewrite all `module.exports` or `exports.xx` magic that might be happening in the code
- it doesn't replace `require()` in the middle of your code with dynamic `import()`

## Named vs default exports

With Taskcluster internal libraries we kept both default and named imports to minimize the impact of the migration.

However, for new code, named exports should be preferred, as it is easier to understand what is being imported.

Consider default export example:

```js
// foo.js
export default (arg) => {
  return arg + 1;
}

// index.js
import foo from './foo.js';
foo(1);

// other.js
import incrementor from './foo.js';
incrementor(1);
```

If you want to refactor you would run into issue, because different files might have given different name for the default export and you would need to update all of them.

```js
export const incrementor(arg) => {
  return arg + 1;
}

// index.js
import { incrementor } from './foo.js';
incrementor(1);

// other.js
import { incrementor } from './foo.js';
incrementor(1);
```

Would make search and replace easier.

## Fixing dynamic exports

Taskcluster used a lot of magic in testing library to mock dependencies for various tests.

Something like this:

```js
// helper.js

exports.withServer = () => {
  setup('server setup', () => {
    exports.server = new ApiClient();
  });
  teardown('server teardown', () => {
    exports.server = null;
  });
}

// client_test.js
const helper = require('./helper.js');

suite('serverTest', () => {
  helper.withServer();

  test('has server', async () => {
    assert.ok(helper.server);
  });
})
```

This kind of magic will not work with ESM as they strictly require to have exports to be statically analyzable.

So one way to fix this issue is to return an object that would be modified by those helper functions,
or make such functions return unique object every time.

```js
// helper.js
// Approach 1

const helper = {};
export default helper;

helper.withServer = () => {
  setup('server setup', () => {
    helper.server = new ApiClient();
  });
  teardown('server teardown', () => {
    helper.server = null;
  });
}
```

This way in your tests you could import `helper` and use it as before.

```js
// helper.js
// Approach 2

export const withServer = () => {
  const helper = {};
  setup('server setup', () => {
    helper.server = new ApiClient();
  });
  teardown('server teardown', () => {
    helper.server = null;
  });
  return helper;
}

// client_test.js
import { withServer } from './helper.js';

suite('serverTest', () => {
  const helper = withServer();

  test('has server', async () => {
    assert.ok(helper.server);
  });
})
```

Both approaches are fine, but in case of Taskcluster it was easier to go with approach 1.

## Importing json files

Node.js allows to use [import assertions](https://nodejs.org/api/esm.html#import-assertions) since v17, but it is still marked as experimented
and you will likely see errors like this:

```
(node:40419) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
```

But you can still use them like this;

```js
import jsonSchemaDraft06 from 'ajv/lib/refs/json-schema-draft-06.json' assert { type: 'json' };
```

Alternatively, to avoid seeing warnings you could just use `fs` to read file:

```js
const jsonSchemaDraft06 = JSON.parse(fs.readFileSync('ajv/lib/refs/json-schema-draft-06.json', 'utf8'));
```

## `__dirname`, `__filename`

Are gone, so if you need them, use [`import.meta`](https://nodejs.org/api/esm.html#esm_import_meta) instead:

```js
const __filename = new URL('', import.meta.url).pathname;
const __dirname = new URL('.', import.meta.url).pathname;
```

## `module.parent` usage

Also no longer available and if you want to know if your module was imported or executed directly you could check same `import.meta.url`:

```js
// before
if (!module.parent) {
  // file was executed directly
  load.crashOnError(process.argv[2]);
}

// after
import { fileURLToPath } from "url";
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  load.crashOnError(process.argv[2]);
}
```

## Conclusion

Migration to ESM is not that hard, but it is not as easy as just adding `"type": "module"` to `package.json`.