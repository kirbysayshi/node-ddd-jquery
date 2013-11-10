
var path = require('path')

var tar = require('tar')
  , zlib = require('zlib')

var request = require('./ghrequest')

module.exports = function(tagdata, outdir, cb) {
  console.error('requesting tag', tagdata.name, tagdata.tarball_url);
  request(tagdata.tarball_url, function(err, res) {
    if (err) return cb(err);

    // The first entry appears to be a nested folder, so stash that for
    // later path creation.
    var prefix = null;

    res
      .pipe(zlib.Gunzip())
      .pipe(tar.Extract({ path: outdir }))
      .on('entry', function(entry) {
        if (!prefix) {
          prefix = entry.props.path;
          console.error('prefix:', prefix);
        }
      })
      .on('error', function(err) {
        cb(err);
      })
      .on('end', function() {
        cb(null, path.normalize(path.join(outdir, prefix)));
      })
  })
}



