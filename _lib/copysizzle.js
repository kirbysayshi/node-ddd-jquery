
var path = require('path')

var fs = require('fs-extra');

module.exports = function(jqpath, destpath, cb) {
  var srcbowerpath = path.join(jqpath, 'bower_components', 'sizzle', 'dist', 'sizzle.js');
  var destbowerpath = path.join(destpath, 'bower-dist-sizzle.js');
  fs.copy(srcbowerpath, destbowerpath, function(err) {
    if (err) return cb(err);
    cb(null, destbowerpath);
  });
}