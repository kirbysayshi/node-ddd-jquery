
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

jQuery is working towards being modular and thus consummable by AMD loaders. Unfortunately, the jQuery repo is not easily consummable via npm or browserify:

* it requires a global install of bower
* it is not published regularly on npm (yet?)
* it is in AMD style
* browserify transforms only work on "top level" modules
* its primary bower dependency, [sizzle][], is not up to date on npm

[sizzle]: https://github.com/jquery/sizzle

I tried just setting the jQuery repo as a dependency in a package.json, but that wouldn't even install due to the bower dependency. Even when I forced it to install, browserify transforms (to convert from AMD to CJS) only operate on "top level" files, meaning files directly included in your module, and not files from other modules. This means it's impossible to transform the jQuery AMD repo at browserify build time.

I also want to note that it's super cool that jQuery is moving towards more modular builds, especially using Grunt. But creating a custom build is something can be handled implicitly via requiring your dependencies using browserify. It's also more difficult to track version numbers and changes when using a custom build vs a package that you require.

How This Works
--------------

This package has a few scripts that grab the latest tagged tarball of jQuery from Github, unpacks it, transforms it and its bower dependencies (sizzle, mainly) into non-AMD CJS (via a custom [deamdify][]), and copies them into the root of this package. It also includes the current bundled version number of jQuery as build metadata of this package (http://semver.org/ #10). For example:

    0.1.2+jquery2.1.0-beta1.1185427

... implies that this package, `v0.1.2` contains jQuery `2.1.0-beta1` which was extracted from the tarball of commit with a sha of `1185427`.

[deamdify]: https://github.com/jaredhanson/deamdify

The actual steps taken to transform the jQuery repo as as follows:

- [x] Query github for jQuery tags
- [x] Download newest tag tarball
- [x] gunzip / untar into _jqsrc
- [x] Blank certain files (intro.js, outro.js, exports/amd.js)
- [x] Transform _jqsrc/**/*.js files:
    ignore (intro.js, outro.js, exports/amd.js) ->
    deamdify ->
    localsizzle ->
    coreversion ("@VERSION" in `core.js` to match tag version)
- [x] bower install (for sizzle) using `_jqsrc/jquery-jquery-[sha]/bower.json` into `root/bower_components`. This also installs qunit and require js to allow the jQuery test suite to run (barely).
- [x] copy `bower_components/sizzle/dist/sizzle.js` to `bower-dist-sizzle.js`
- [x] Remove the UMD guard within sizzle to allow tests to run, since they use requirejs.
- [x] *optional* copy jQuery tests to ./
- [x] *optional* build a full browserified jquery to ./dist/jquery{.min,}.js.
- [x] Write current jquery version information as build metadata to package.json.
- [x] Bump package.json patch version.
- [x] Sanity check: ensure that a few files are present (jquery.js, core.js, sizzle.js, etc), and that build info in package.json matches `require('./core').fn.jquery`.

Developing
----------

Pretty simple actually. To avoid conflicts, all scripts specific to this package are in `_` prefixed folders. There is also an `npm run clean` command that will delete everything in the repo that is not explicitly tracked by git (excluding the `node_modules` folder).

Github does rate limit, so keep in mind if constantly testing.

To Release a New Nersion
------------------------

This is as much a reminder to me as information for all to understand.

- Run `node _bin/prepublish.js`.
- Serve the root directory using PHP. If you have `>= PHP 5.4`, then `php -S localhost:8000` will do the trick.
- Visit `http://localhost:8000/test?dev` and ensure that a majority of the tests pass. The current AMD-ified version of jQuery is a beta tag, so I'm assuming not all tests are currently passing.
- Ensure that the version in `package.json` adequately matches jQuery changes. For example, if the previous time this package was released, the jQuery version was `2.1.0-beta1`, and now it's `2.1.0`, bump the minor version of this package. The basic idea is that if something changes in jQuery, this package's version should semantically match.
- `npm publish`
- Commit changes (since prepublish will bump version for you)

Credits
-------

- [deamdify][], by [jaredhanson](https://github.com/jaredhanson) is included with custom modifications

LICENSE
-------

MIT
