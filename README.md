Simple Console
==============

Provides a simple, but useful cross-browser-compatible `console` logger.

[![Build Status][trav_img]][trav_site]
[![Coverage Status][cov_img]][cov_site]

### Features

* Proxies to native functionality wherever possible.
* Enables `.apply` and `.bind` usage with `console.OPERATION`.
* Buildable from straight CommonJS source.
* Available as bundled distributions as well.

### Installation

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
<script src="PATH/TO/simple-console/simple-console.js"></script>
```

In your JS:

```js
var con = new window.SimpleConsole();
con.log("Hello world!");
```

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

### Also See

Similar projects that can help with `console`:

* [`console-polyfill`](https://github.com/paulmillr/console-polyfill)
* [`console.log-wrapper`](https://github.com/patik/console.log-wrapper)

### License
Copyright 2015 Formidable Labs, Inc.
Released under the [MIT](./LICENSE.txt) License,

[trav]: https://travis-ci.org/
[trav_img]: https://api.travis-ci.org/FormidableLabs/simple-console.svg
[trav_site]: https://travis-ci.org/FormidableLabs/simple-console
[cov]: https://coveralls.io
[cov_img]: https://img.shields.io/coveralls/FormidableLabs/simple-console.svg
[cov_site]: https://coveralls.io/r/FormidableLabs/simple-console
