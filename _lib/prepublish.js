#!/usr/bin/env node

var path = require('path')

var tags = require('./tags')
  , tarball = require('./tarball')
  , bowerinstall = require('./bowerinstall')
  , transform = require('../_lib/transform')
  , copysizzle = require('../_lib/copysizzle')

// TODO: use a real logger.

// Steps to a successful publish:
// - [x] Query for jQuery tags from github
// - [x] Download newest tag tarball
// - [x] gunzip / untar into _jqsrc
// - [ ] transform _jqsrc/**/*.js files via deamdify -> ./
// - [ ] transform _jqsrc/**/*.js files via localsizzle -> ./
// - [ ] transform "@VERSION" in `core.js` to match tag version
// - [x] cd _jqsrc, bower install (for sizzle)
// - [ ] copy "_jqsrc/bower_components/sizzle/dist/sizzle.js" to _jqsrc/bower-dist-sizzle.js
// - [ ] *optional* copy tests to ./, build a full browserified jquery to ./dist/jquery.min.js index.html should _just work_. Run tests.
// - [ ] Write current jquery version information as build info to package.json. Bump version according to diff of jQuery package version and last build info. e.g. 1.0.0+jquery-2.1.0-beta initially, jquery 2.1.0 is released, 1.1.0+jquery-2.1.0? Or just leave version alone, and output the diff of jquery version numbers.
// - [ ] On prepublish, ensure that a few files are present (jquery.js, core.js, sizzle.js, etc), and that build info in package.json matches `require('./core').fn.jquery`.

// - [x] Query for jQuery tags from github
tags('jquery/jquery', '>2.0.3 <3', function(err, tagdata) {

  // - [x] Download newest tag tarball
  // - [x] gunzip / untar into _jqsrc
  tarball(tagdata, path.join(__dirname, '..', '_jqsrc'), function(err, jqpath) {

    //var srcpath = path.join(__dirname, '..', '_jqsrc', 'jquery-jquery-1185427', 'src');
    var srcpath = path.join(jqpath, 'src');
    var destpath = path.join(__dirname, '..');

    // - [ ] transform _jqsrc/**/*.js files via deamdify -> ./
    // - [ ] transform _jqsrc/**/*.js files via localsizzle -> ./
    // - [ ] transform "@VERSION" in `core.js` to match tag version
    transform(srcpath, destpath, tagdata.name, function(err) {
      if (err) {
        throw err;
      }

      // - [ ] cd _jqsrc, bower install (for sizzle)
      bowerinstall(jqpath, function(err, results) {
        if (err) throw err;

        // - [ ] copy "_jqsrc/bower_components/sizzle/dist/sizzle.js" to _jqsrc/bower-dist-sizzle.js
        copysizzle(jqpath, destpath, function(err, sizzlepath) {

        })
      });
    });





  })
})

//get(onSource);
//var srcpath = path.join(__dirname, '..', '_jqsrc', 'jquery-jquery-1185427', 'src');
//console.log(srcpath);
//onSource(null, srcpath)

/*function onSource(err, srcpath) {
  if (err) {
    console.error(err);
    return process.exit(10);
  }

  transform(srcpath, path.join(__dirname, '../'), function(err) {
    if (err) {
      throw err;
    }
  });
}
*/

