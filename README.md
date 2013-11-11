
ddd-jquery
==========

de-bowerified, de-amdified, de-gruntified... jQuery. Best used via [browserify][], when you don't want to include _all_ of jQuery, just the parts you need.

[browserify]: https://github.com/substack/node-browserify

usage
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

rationale
---------

jQuery is working towards being modular and thus consummable by AMD loaders. Unfortunately, the jQuery repo is not easily consummable via npm or browserify:

* it requires a global install of bower
* it's not published regularly on npm
* it's in AMD style
* browserify transforms only work on "top level" modules
* it's primary bower dependency, [sizzle][] is not up to date on npm

[sizzle]: https://github.com/jquery/sizzle

I tried just setting the jQuery repo as a dependency in a package.json, but that wouldn't even install due to the bower dependency. Even when I forced it to install, browserify transforms (to convert from AMD to CJS) only operate on "top level" files, meaning files directly included in your module, and not files from other modules. This means it's impossible to transform the jQuery AMD repo at browserify build time.

[deamdify]: https://github.com/jaredhanson/deamdify

how this works
--------------

This package has a few scripts that grab the latest tagged tarbal of jQuery from Github, unpacks it, transforms it and its bower dependencies (sizzle, mainly) into non-AMD CJS (via a custom [deamdify][]), and copies them into the root of this package. It also includes the current bundled version number of jQuery as build metadata of this package (http://semver.org/ #10). For example:

    0.1.2+jquery2.1.0-beta1.1185427

... implies that this package, `v0.1.2` contains jQuery `2.1.0-beta` which was extracted from the tarball of commit with a sha of `1185427`.

developing
----------

Pretty simple actually. To avoid conflicts, all scripts specific to this package are in `_` prefixed folders. There is also an `npm run clean` command that will delete everything in the repo that is not explicitly tracked by git (excluding the `node_modules` folder).

Github does rate limit, so keep in mind if constantly testing.

to release a new version
------------------------

This is as much a reminder to me as information for all to understand.

- Run `node _lib/prepublish.js`.
- Serve the root directory using PHP. If you have `>= PHP 5.4`, then `php -S localhost:8000` will do the trick.
- Visit `http://localhost:8000/test?dev` and ensure that a majority of the tests pass. The current AMD-ified version of jQuery is a beta tag, so I'm assuming not all tests are currently passing.
- Ensure that the version in `package.json` adaquately matches jQuery changes. For example, if the previous time this package was released, the jQuery version was `2.1.0-beta1`, and now it's `2.1.0`, bump the minor version of this package. The basic idea is that if something changes in jQuery, this package's version should semantically match.
- Commit changes
- `npm publish`

