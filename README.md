
ddd-jquery
==========

de-bowerified, de-amdified, de-gruntified... jQuery. Best used via [browserify][], when you don't want to include _all_ of jQuery, just the parts you need.

Plus, it rhymes.

[browserify]: https://github.com/substack/node-browserify

Usage
-----

````
$ npm install --save ddd-jquery
````

The most basic jQuery:

````js
var $ = require('ddd-jquery/core')
````

Perhaps you only want some parts?

````js
var $ = require('ddd-jquery/core')
require('ddd-jquery/manipulation')
require('ddd-jquery/effects')
````

Perhaps you want a fully-armed and operational jQuery?

````js
var $ = require('ddd-jquery');
````

Perhaps you want to avoid repetition?

````js
// in your own lib/jquery.js
module.exports = require('ddd-jquery/core');
require('ddd-jquery/manipulation')
require('ddd-jquery/effects')
require('ddd-jquery/traversal')
require('ddd-jquery/deferred')
````

jQuery is still relatively interdependent on itself, so I recommend using their [modules list][] for hints on what combinations of modules will actually make a difference. For example, if you do `require('ddd-jquery/manipulation')`, that implicitly brings along `core`, `traversing`, `events`, and more.

[modules list]: https://github.com/jquery/jquery#modules

Rationale
---------

jQuery is now published on npm as a single, built file. So this is good! Sometimes, you might want only parts of jQuery without needing a separate build step. Also, tracking what was cut out of a custom jQuery build is tough a few months later when a new version of jQuery is out.

jQuery has a few components that make consuption of a modular build difficult from a CJS system like browserify:

* jQuery is AMD style
* browserify transforms only work on "top level" modules
* its primary bower dependency, [sizzle][], is not up to date on npm

[sizzle]: https://github.com/jquery/sizzle

How This Works
--------------

This package has a few scripts that take a local, `npm install`ed version of jQuery, and transforms it and its bower dependencies (sizzle, currently) by running them through a custom [deamdify][] and copying them into the root of this package, which is then published to npm. It also includes the current bundled version number of jQuery as build metadata of this package (http://semver.org/ #10). For example:

    0.4.0+jquery.2.1.0-beta3

... implies that this package, `v0.4.0` contains jQuery `2.1.0-beta3` from npm.

[deamdify]: https://github.com/jaredhanson/deamdify

The actual steps taken to transform the jQuery repo as as follows:

- [x] Copy `node_modules/jquery/src` and...
- [x] Transform *.js files:
    ignore (intro.js, outro.js, exports/amd.js) ->
    deamdify ->
    localsizzle ->
    coreversion ("@VERSION" in `core.js` to match tag version)
- [x] bower install (for sizzle) using `node_modules/jquery/bower.json` into `root/bower_components`. This also installs qunit and require js to allow the jQuery test suite to run (barely).
- [x] copy `bower_components/sizzle/dist/sizzle.js` to `bower-dist-sizzle.js`
- [x] Remove the UMD guard within sizzle to allow tests to run, since they use requirejs.
- [x] *optional* copy jQuery tests to ./
- [x] *optional* build a full browserified jquery to ./dist/jquery{.min,}.js.
- [x] Write current jquery version information as build metadata to package.json.
- [x] Sanity check: ensure that a few files are present (jquery.js, core.js, sizzle.js, etc), and that build info in package.json matches `require('./core').fn.jquery`.

Developing
----------

Pretty simple actually. To avoid conflicts, all scripts specific to this package are in `_` prefixed folders. There is also an `npm run clean` command that will delete everything in the repo that is not explicitly tracked by git (excluding the `node_modules` folder).

To Release a New Version
------------------------

This is as much a reminder to me as information for all to understand.

- Run `node _bin/prepublish.js`. Optionally run it with an argument to automatically bump `ddd-jquery`'s version, e.g. `node _bin/prepublish.js minor`.
- Serve the root directory using PHP. If you have `>= PHP 5.4`, then `php -S localhost:8000` will do the trick.
- Visit `http://localhost:8000/test?dev` and ensure that a majority of the tests pass. The current AMD-ified version of jQuery is a beta tag, so I'm assuming not all tests are currently passing. (NOTE: as of 0.4.0 this is currently broken, since the npm version of jQuery does not contain the test suite.)
- Ensure that the version in `package.json` adequately matches jQuery changes. For example, if the previous time this package was released, the jQuery version was `2.1.0-beta1`, and now it's `2.1.0`, bump the minor version of this package. The basic idea is that if something changes in jQuery, this package's version should semantically match (not necessarily in numeric value).
- `npm publish`
- Commit changes. Be sure you bump the package version while preserving the jQuery build metadata!

Credits
-------

- [deamdify][], by [jaredhanson](https://github.com/jaredhanson) is included with custom modifications

LICENSE
-------

MIT
