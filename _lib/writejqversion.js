
var fs = require('fs-extra');

var semver = require('semver');

module.exports = function(pkgPath, tagdata, release, cb) {
  var pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  var bumped = semver.inc(pkg.version, release);
  var shortsha = tagdata.commit.sha.substring(0, 7);
  var jqversion = 'jquery.' + tagdata.name + '.' + shortsha;

  pkg.version = bumped + '+' + jqversion;
  var out = fs.createWriteStream(pkgPath)
    .on('finish', function() { cb(null, pkg.version); })
    .on('error', cb);

  out.write(JSON.stringify(pkg, null, '  '));
  out.end();
}