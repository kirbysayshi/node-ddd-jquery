
ddd-jquery
==========

de-bowerified, de-amdified, de-gruntified... jQuery. Best used via [browserify][].

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
* it's in AMD style, is pretty easy to get over via [deamdify][]

I tried just setting the jQuery repo as a dependency in a package.json, but that wouldn't even install due to the bower dependency.

[deamdify]: https://github.com/jaredhanson/deamdify

how this works
--------------

This package has a [postinstall][] script that downloads the newest tagged tarball of jQuery from Github, unpacks it, and transforms each file in the [src][] directory, via [deamdify][]. It outputs the transformed files into the root of this package, making for easy `require` statements.

BUT WAIT I THOUGHT [postinstall][] WAS AN ANTIPATTERN.

Yeah, it might be, even in this case. I may end up packaging the transformed files into this repo. We'll see.

[postinstall]: https://npmjs.org/doc/misc/npm-scripts.html
[src]: https://github.com/jquery/jquery/tree/master/src

developing
----------

Pretty simple actually. To avoid conflicts, all scripts specific to this package are in `_` prefixed folders. There are also a `npm run clean` command that will delete everything in the repo that is not explicitly tracked by git (excluding the `node_modules` folder).

Keep in mind that Github rate limits, so keep in mind if constantly testing.


