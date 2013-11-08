
var https = require('https')
  , path = require('path')

  , semver = require('semver')
  , tar = require('tar')
  , zlib = require('zlib')

  , request = require('./ghrequest')

module.exports = function(cb) {
  getLatestTag(function(err, tag) {
    if (err) return cb(err);
    unpack(tag, function(err, srcpath) {
      if (err) {
        console.log(err);
        return cb(err);
      }
      return cb(null, srcpath);
    });
  })
}

function getLatestTag(cb) {

  https.get('https://api.github.com/repos/jquery/jquery/tags', function(res) {
    var buf = '';
    res.on('data', function(d) {
      buf += d;
    })

    res.on('end', function() {
      var tags = JSON.parse(buf);

      // Only grab 2.x.x and non-prerelease tags
      var valids = tags.filter(function(t) {
        try {
          return semver.satisfies(t.name, '>2.0.3');
        } catch(e) {
          if (!(e instanceof TypeError)) throw e;
          return false;
        }
      });

      // Ensure sorted in descending order.
      valids = valids.sort(function(a, b) {
        return semver.rcompare(a.name, b.name);
      });

      if (!valids.length) {
        return cb(new Error('No valid jQuery tags found.'));
      }

      return cb(null, valids[0]);
    })
  }).on('error', function(err) {
    cb(err);
  });
}

function unpack(tag, cb) {
  console.error('requesting tag', tag.name, tag.tarball_url);
  request(tag.tarball_url, function(err, res) {
    if (err) return cb(err);

    // The first entry appears to be a nested folder, so stash that for
    // later path creation.
    var prefix = null;

    res
      .pipe(zlib.Gunzip())
      .pipe(tar.Extract({ path: path.join(__dirname, '..', 'jqsrc') }))
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
        cb(null, path.normalize(path.join(__dirname, '..', 'jqsrc', prefix, 'src')));
      })
  })
}



