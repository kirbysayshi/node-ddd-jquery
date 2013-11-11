
var bower = require('bower');

module.exports = function(root, installtarget, cb) {
  bower.commands.install([], {}, { cwd: root, directory: installtarget })
    .on('log', function(log) {
      console.log('bower: [' + log.level + '] ' + log.id + ': ' + log.message);
    })
    .on('error', cb)
    .on('end', function(results) {
      cb(null, results);
    });
}