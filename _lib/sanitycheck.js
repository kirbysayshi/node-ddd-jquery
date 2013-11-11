
var path = require('path');
var fs = require('fs-extra');

/**
 * Perform a sanity check on the jQuery files. This is a poor-man's
 * integration test of sorts.
 * @param  {string}   dir The directory to use to perform the checks.
 * @param  {Function} cb fn(err = null) if the check passes.
 */
module.exports = function(dir, cb) {

  // Ensure that several key files are present:
  var keyfiles = [
    'jquery.js',
    'core.js',
    'bower-dist-sizzle.js'
  ];

  checkFileExistence(keyfiles, function(err) {
    if (err) return cb(err);
  });

  // Ensure that the jquery version specified in the build metadata
  // of package.json matches that in the local directory.
  compareVersions(function(err) {
    if (err) return cb(err);
  })
}

function checkFileExistence(files, cb) {
  var waiting = files.length;
  files.forEach(function(file) {
    fs.stat(file, onstat);
  });

  function onstat(err, stats) {
    waiting -= 1;
    if (err) return cb(err);
    else if (waiting == 0) return cb(null);
  }
}

function compareVersions(cb) {

  var pkgPath = path.join(__dirname, '..', 'package.json');
  var pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  var buildMeta = pkg.version.split('+')[1];
  if (!buildMeta) {
    var err = new Error('Build metadata in version field ('
      + pkg.version
      + ') does not exist');
    return cb(err);
  }

  var buildTagName = buildMeta
    .replace('jquery.', '')
    .replace(/\.[a-z0-9]+$/, '');

  // First provide the most basic shim for core jquery to load in node.
  global.window = {};
  var jq = require('../core');

  if (jq.fn.jquery !== buildTagName) {
    var msg = 'jQuery.fn.jquery (' + jq.fn.jquery + ') '
      + 'does not match build metadata (' + buildTagName + ')';
    return cb(new Error(msg));
  }

  return cb(null);
}