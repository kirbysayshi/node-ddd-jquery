#!/usr/bin/env node

var path = require('path')

var fs = require('fs-extra')
  , browserify = require('browserify')

var bowerinstall = require('../_lib/bowerinstall')
  , transform = require('../_lib/transform')
  , copysizzle = require('../_lib/copysizzle')
  , writejqversion = require('../_lib/writejqversion')
  , sanitycheck = require('../_lib/sanitycheck')

// TODO: use a real logger.

var pkgVersionInc = process.argv[2];

var jqpkgpath = require.resolve('jquery/package.json');
var jqpkg = require(jqpkgpath);
var jqpath = path.dirname(jqpkgpath);
var srcpath = path.join(jqpath, 'src');
var destpath = path.join(__dirname, '..');

// transform jqsrc/**/*.js files and copy to root relatively.
transform(srcpath, destpath, jqpkg.version, function(err) {
  if (err) throw err;

  // bower install (for sizzle. includes qunit, requirejs for running
  // tests), but install into project root, using _jqsrc as base.
  // Apparently bower requires a relative path to specify a custom
  // bower_components directory.
  var componentsPath = path.join('..', '..', 'bower_components');
  bowerinstall(jqpath, componentsPath, function(err, results) {
    if (err) throw err;

    // copy "bower_components/sizzle/dist/sizzle.js" to bower-dist-sizzle.js
    // and remove its UMD guard.
    copysizzle(destpath, destpath, function(err, sizzlepath) {
      if (err) throw err;

      // Write the current jquery version as build metadata in package.json.
      var dddpkgpath = path.join(destpath, 'package.json');
      writejqversion(dddpkgpath, jqpkg.version, pkgVersionInc, function(err, dddversion) {
        if (err) throw err;
        console.log('[prepublish]', 'ddd-jquery', dddversion);

        // Copy tests to / to help development.
        // NOTE: we don't care if this succeeds or not.
        // TODO: this should be a separate "task" or script to make this
        // script more easily maintainable.
        fs.copy(path.join(jqpath, 'test'), path.join(destpath, 'test'), function(err) {
          if (err) {
            console.log('[prepublish]', 'Error while attempting to copy jQuery tests:');
            console.log('[prepublish]', err);
          }
        });

        // browserify ../jquery > ../dist/jquery.{min.,}js to be able to
        // run the tests.
        // NOTE: not important whatsoever to the actual package, just for
        // trying to run the jQuery tests with the transformed files.
        var dist = path.join(destpath, 'dist');
        fs.mkdirs(dist, function(err) {
          if (err) {
            console.log('[prepublish]', err);
            return;
          }
          var b = browserify();
          b.add(path.join(destpath, 'jquery.js'));
          var bundle = b.bundle();
          bundle.pipe(fs.createWriteStream(path.join(dist, 'jquery.min.js')))
          bundle.pipe(fs.createWriteStream(path.join(dist, 'jquery.js')))
        });

        // Lastly, perform the santity check that we are ready to publish.
        sanitycheck(destpath, function(err) {
          if (err) throw err;
          console.log('[sanitycheck]', 'Cast in the name of science, ye are sane?')
          process.exit(0);
        })
      })
    })

  });
});
