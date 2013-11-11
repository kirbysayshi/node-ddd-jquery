
var bower = require('bower');

module.exports = function(root, installtarget, cb) {
  bower.commands.install([], {}, { cwd: root, directory: installtarget })
    .on('log', console.log.bind(console))
    .on('error', cb)
    .on('end', function(results) {
      cb(null, results);
    });
}