#!/usr/bin/env node

var path = require('path')

var fs = require('fs-extra')
  , browserify = require('browserify')

var tags = require('./tags')
  , tarball = require('./tarball')
  , bowerinstall = require('./bowerinstall')
  , transform = require('../_lib/transform')
  , copysizzle = require('../_lib/copysizzle')
  , writejqversion = require('../_lib/writejqversion')

// TODO: use a real logger.

// Steps to a successful publish:
// - Query for jQuery tags from github
// - Download newest tag tarball
// - gunzip / untar into _jqsrc
// - transform _jqsrc/**/*.js files via deamdify -> ./
// - transform _jqsrc/**/*.js files via localsizzle -> ./
// - transform "@VERSION" in `core.js` to match tag version
// - cd _jqsrc, bower install (for sizzle)
// - copy "_jqsrc/bower_components/sizzle/dist/sizzle.js" to _jqsrc/bower-dist-sizzle.js
// - *optional* copy tests to ./, build a full browserified jquery to ./dist/jquery.min.js index.html should _just work_. Run tests.
// - Write current jquery version information as build info to package.json. Bump version according to diff of jQuery package version and last build info. e.g. 1.0.0+jquery-2.1.0-beta initially, jquery 2.1.0 is released, 1.1.0+jquery-2.1.0? Or just leave version alone, and output the diff of jquery version numbers.
// - On prepublish, ensure that a few files are present (jquery.js, core.js, sizzle.js, etc), and that build info in package.json matches `require('./core').fn.jquery`.

// Query for jQuery tags from github
tags('jquery/jquery', '>2.0.3 <3', function(err, tagdata) {

  console.log('Found jQuery tag data:', tagdata);

  // Download newest tag tarball
  // gunzip / untar into _jqsrc
  tarball(tagdata, path.join(__dirname, '..', '_jqsrc'), function(err, jqpath) {

    //var srcpath = path.join(__dirname, '..', '_jqsrc', 'jquery-jquery-1185427', 'src');
    var srcpath = path.join(jqpath, 'src');
    var destpath = path.join(__dirname, '..');

    // ignore certain files
    // transform _jqsrc/**/*.js files via deamdify -> ./
    // transform _jqsrc/**/*.js files via localsizzle -> ./
    // transform "@VERSION" in `core.js` to match tag version
    transform(srcpath, destpath, tagdata.name, function(err) {
      if (err) throw err;

      // bower install (for sizzle. includes unit, requirejs for running
      // tests), but install into project root, using _jqsrc as base.
      // Apparently bower requires a relative path to specify a custom
      // bower_components directory.
      bowerinstall(jqpath, path.join('..', '..', 'bower_components'), function(err, results) {
        if (err) throw err;

        // copy "bower_components/sizzle/dist/sizzle.js" to bower-dist-sizzle.js
        // and remove its UMD guard.
        copysizzle(destpath, destpath, function(err, sizzlepath) {
          if (err) throw err;

          var pkgPath = path.join(destpath, 'package.json');
          writejqversion(pkgPath, tagdata, 'patch', function(err, dddversion) {
            if (err) throw err;
            console.log('ddd-jquery:', dddversion);
          })


          // Copy tests to / to help development.
          fs.copy(path.join(jqpath, 'test'), path.join(destpath, 'test'), function(err) {

          });

          // browserify ../jquery > ../dist/jquery.{min.,}js to be able to
          // run the tests.
          var dist = path.join(destpath, 'dist');
          fs.mkdirs(dist, function(err) {
            if (err) throw err;
            var b = browserify();
            b.add(path.join(destpath, 'jquery.js'));
            var bundle = b.bundle();
            bundle.pipe(fs.createWriteStream(path.join(dist, 'jquery.min.js')))
            bundle.pipe(fs.createWriteStream(path.join(dist, 'jquery.js')))
          })

        })
      });
    });
  })
})
