
var fs = require('fs-extra')
  , path = require('path')
  , glob = require('glob')

  , deamdify = require('./deamdify')

// There are some jquery files that are not valid JS, and are only used in
// the custom build, so skip them.
var skipFiles = ['intro.js', 'outro.js'];

// Given a source path, and destination, deamdify all .js files and copy them
// relatively to destpath.
module.exports = function(srcpath, destpath, cb) {

  console.error('src', srcpath);
  console.error('dest', destpath);

  glob(path.join(srcpath, '/**/*.js'), function(err, matches) {
    if (err) return cb(err);

    var waiting = 0;

    matches.forEach(function(m) {
      var filename = path.basename(m);
      if (skipFiles.indexOf(filename) > -1) return;

      waiting += 1;

      var outpath = path.join(destpath, m.replace(srcpath, ''));

      fs.createFile(outpath, function(err) {
        if (err) return cb(err);

        var input = fs.createReadStream(m, 'utf8');
        var output = fs.createWriteStream(outpath, 'utf8');

        input.on('error', cb);

        input
          .pipe(deamdify(m))
          .pipe(output)
          .on('finish', onend)
          .on('error', cb)
      })
    });

    function onend() {
      waiting -= 1;
      if (waiting === 0) {
        return cb(null);
      }
    }

  })
}