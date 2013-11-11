
var path = require('path')
var fs = require('fs-extra');
var removeumdsizzle = require('../_transforms/removeumdsizzle');

module.exports = function(jqpath, destpath, cb) {
  var srcbowerpath = path.join(jqpath, 'bower_components', 'sizzle', 'dist', 'sizzle.js');
  var destbowerpath = path.join(destpath, 'bower-dist-sizzle.js');

  var input = fs.createReadStream(srcbowerpath);
  var output = fs.createWriteStream(destbowerpath);

  input
    .pipe(removeumdsizzle(srcbowerpath))
    .pipe(output)
    .on('finish', function() { cb(null); })
    .on('error', cb);
}