
var through = require('through')

module.exports = function(file) {

  var stream;

  // Effectively discard the contents of the files listed.
  if (
    file.indexOf('exports/amd') > -1
    || file.indexOf('intro.js') > -1
    || file.indexOf('outro.js') > -1
  ) {
    stream = through(function() {}, function() { this.queue(null); });
  } else {
    stream = through();
  }

  return stream;
}