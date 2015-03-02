Simple Console
==============

Provides a simple, but useful cross-browser-compatible `console` logger.

[![Build Status][trav_img]][trav_site]
[![Coverage Status][cov_img]][cov_site]

[![Sauce Test Status][sauce_img]][sauce_site]

### Features

* Proxies to native functionality wherever possible.
* Enables `.apply` and `.bind` usage with `console.OPERATION`.
* Buildable from straight CommonJS source.
* Available as minified distributions as well.

### Installation

Install via [npm](https://www.npmjs.com/package/simple-console):

```
$ npm install simple-console
```

or [bower](http://bower.io/search/?q=simple-console):

```
$ bower install simple-console
```

### Usage

Import the `SimpleConsole` class into your code (via AMD, CommonJS, etc) and
use as a drop-in replacement for `console.OPERATION`. Creating a new object
does _not_ effect the existing `window.console` object.

#### AMD

```js
define(["simple-console"], function (SimpleConsole) {
  var con = new SimpleConsole();
  con.log("Hello world!");
});
```

#### CommonJS

```js
var SimpleConsole = require("simple-console");
var con = new SimpleConsole();
con.log("Hello world!");
```

#### VanillaJS

In your HTML:

```html
<!-- Option One: Minified -->
<script src="PATH/TO/simple-console/dist/simple-console.min.js"></script>

<!-- Option Two: Raw source -->
<script src="PATH/TO/simple-console/simple-console.js"></script>
```

In your JS:

```js
var con = new window.SimpleConsole();
con.log("Hello world!");
```

### Noop Logger

There are some cases where you will want to conditionally silence the logger.
You can do this by passing `null` as the `target` parameter to the logger like:

```js
var con = new SimpleConsole({ noop: true });
con.log("Hello world!"); // => Should _not_ output anything.
```

This is usually useful in a case where you build different capabilities based
on some external information, for example, React-style, this could be
something like:

```js
var con = new SimpleConsole({
  noop: process.env.NODE_ENV === "production"
});

con.log("Hello world!"); // => Should _not_ output anything in `production`.
```

### Polyfill

If you are looking to **polyfill** `console`, then you can:

```js
new SimpleConsole({ patch: true });
```

This **will** mutate the `window.console` object in ways that are not easily
undone, so consider this a "one way" patch. Moreover, if `window.console`
does not exist, it will create the object.

You can even go further and patch _and_ noop the logger with:

```js
new SimpleConsole({ patch: true, noop: true });
```

which ensures that _nothing_ logs anything.

**Note**: In addition to filling/patching missing behavior, the polyfill will
replace behavior that already _exists_ and _works_. This is presently due to
complexities likely normalizing and ensuring things like `.bind`, `.apply`
and `.call` work on all log methods.


### Development

Run checks, then development server:

```
$ gulp
```

Separated:

```
$ gulp check
$ gulp dev
```

Navigations:

* **Test Page**: http://127.0.0.1:4321/test/test.html
* **Demo Page**: http://127.0.0.1:4321/examples/demo.html

Release process:

* Bump versions in `package.json`, `bower.json`
* Run `npm run-script dist`
* Edit `HISTORY.md`
* Run `gulp check:all`

### Also See

Similar projects that can help with `console`:

* [`console-polyfill`](https://github.com/paulmillr/console-polyfill)
* [`console.log-wrapper`](https://github.com/patik/console.log-wrapper)

### License
Copyright 2015 Formidable Labs, Inc.
Released under the [MIT](LICENSE.txt) License,

[trav]: https://travis-ci.org/
[trav_img]: https://api.travis-ci.org/FormidableLabs/simple-console.svg
[trav_site]: https://travis-ci.org/FormidableLabs/simple-console
[cov]: https://coveralls.io
[cov_img]: https://img.shields.io/coveralls/FormidableLabs/simple-console.svg
[cov_site]: https://coveralls.io/r/FormidableLabs/simple-console
[sauce]: https://saucelabs.com
[sauce_img]: https://saucelabs.com/browser-matrix/simple-console.svg
[sauce_site]: https://saucelabs.com/u/simple-console
