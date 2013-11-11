
var fs = require('fs-extra')
  , path = require('path')
  , glob = require('glob')

  , discards = require('../_transforms/discards')
  , deamdify = require('../_transforms/deamdify')
  , localsizzle = require('../_transforms/localsizzle')
  , coreversion = require('../_transforms/coreversion')

// Given a source path, and destination, deamdify all .js files and copy them
// relatively to destpath.
module.exports = function(srcpath, destpath, version, cb) {

  console.log('[transform]', 'src', srcpath);
  console.log('[transform]', 'dest', destpath);

  var waiting = 0;

  glob(path.join(srcpath, '/**/*.js'), function(err, matches) {
    if (err) return cb(err);

    matches.forEach(function(m) {
      var filename = path.basename(m);

      waiting += 1;

      var outpath = path.join(destpath, m.replace(srcpath, ''));

      fs.createFile(outpath, function(err) {
        if (err) return cb(err);

        var input = fs.createReadStream(m, 'utf8');
        var output = fs.createWriteStream(outpath, 'utf8');

        input.on('error', cb);

        input
          .pipe(discards(m))
          .pipe(deamdify(m))
          .pipe(localsizzle(m, './bower-dist-sizzle'))
          .pipe(coreversion(m, version))
          .pipe(output)
          .on('finish', onend)
          .on('error', cb)
      })
    });
  });

  function onend() {
    waiting -= 1;
    if (waiting === 0) {
      return cb(null);
    }
  }
}