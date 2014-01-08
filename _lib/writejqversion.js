
var fs = require('fs-extra');

var semver = require('semver');

module.exports = function(pkgPath, jqPkgVersion, release, cb) {
  var pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  var bumped = release
    ? semver.inc(pkg.version, release)
    : semver.valid(pkg.version);
  var jqversion = 'jquery.' + jqPkgVersion;

  pkg.version = bumped + '+' + jqversion;
  var out = fs.createWriteStream(pkgPath)
    .on('finish', function() { cb(null, pkg.version); })
    .on('error', cb);

  out.write(JSON.stringify(pkg, null, '  '));
  out.end();
}