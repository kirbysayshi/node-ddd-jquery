
var https = require('https')

var semver = require('semver')

/**
 * Queries github for the latest tag data for the given repo that
 * satisfies the given semver tagRange.
 *
 * ex: tags('jquery/jquery', '>2.0.3', function(err, tagdata) {})
 */
module.exports = function(repo, tagRange, cb) {

  https.get('https://api.github.com/repos/' + repo + '/tags', function(res) {
    var buf = '';
    res.on('data', function(d) {
      buf += d;
    });

    res.on('end', function() {
      var tags = JSON.parse(buf);

      // Only grab 2.x.x
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
        return cb(new Error('No valid ' + repo + ' tags found.'));
      }

      return cb(null, valids[0]);
    });
  }).on('error', function(err) {
    cb(err);
  });
}