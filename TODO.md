
TODO
====

- [ ] Include jquery version number in published package. For example, package 0.2.0 with jquery 2.1.0-beta would be 0.2.0+jquery-2.1.0-beta.XXXXXX where XXXXXX is the commit hash from the tarball.
- [ ] Create script to do the above
- [ ] Add empty .npmignore to ensure that even though jquery files are gitignored, they are included in package on publish.
- [ ] Include current jquery files in published package.
- [ ] Somehow consume jquery test suite.


Dev Pipeline
------------

- [x] Query for jQuery tags from github
- [x] Download newest tag tarball
- [x] gunzip / untar into _jqsrc
- [ ] transform _jqsrc/**/*.js files via deamdify -> ./
- [ ] transform _jqsrc/**/*.js files via localsizzle -> ./
- [ ] transform "@VERSION" in `core.js` to match tag version
- [ ] cd _jqsrc, bower install (for sizzle)
- [ ] copy "../bower_components/sizzle/dist/sizzle.js" to _jqsrc/bower-dist-sizzle.js
- [ ] *optional* copy tests to ./, build a full browserified jquery to ./dist/jquery.min.js index.html should _just work_. Run tests.
- [ ] Write current jquery version information as build info to package.json. Bump version according to diff of jQuery package version and last build info. e.g. 1.0.0+jquery-2.1.0-beta initially, jquery 2.1.0 is released, 1.1.0+jquery-2.1.0? Or just leave version alone, and output the diff of jquery version numbers.
- [ ] On prepublish, ensure that a few files are present (jquery.js, core.js, sizzle.js, etc), and that build info in package.json matches `require('./core').fn.jquery`.


