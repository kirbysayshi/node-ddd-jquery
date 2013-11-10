
var through = require('through')

module.exports = function(file, version) {
  var data = '';
  
  var stream = through(write, end);
  return stream;
  
  function write(buf) { data += buf }
  function end() {

    var out = file.indexOf('core.js') > -1
      ? data.replace(/@VERSION/g, version)
      : data;

    stream.queue(out);
    stream.queue(null);
  }
}