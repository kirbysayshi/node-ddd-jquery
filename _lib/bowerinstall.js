
var bower = require('bower');

module.exports = function(root, cb) {
  bower.commands.install([], {}, { cwd: root })
    .on('log', console.log.bind(console))
    .on('error', cb)
    .on('end', function(results) {
      cb(null, results);
    });
}