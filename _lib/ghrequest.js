
var https = require('https')

// Make a request to the specified url, and follow any redirect headers.
// Assumes target is github.com.
module.exports = function request(url, onRes) {
  https.get(url, function(res) {

    if (res.headers['x-ratelimit-remaining']) {
      console.error('GH Rate Limit Remaining: '
        + res.headers['x-ratelimit-remaining']);
    }

    switch(res.statusCode) {

      case 200:
        onRes(null, res);
        break;

      case 301:
      case 302:
      case 303:
      case 304:
      case 307:
        // Continue requesting until we get a concrete tar.
        if (res.headers.location) {
          process.stderr.write('Location: ' + res.headers.location + '\n');
          return request(res.headers.location, onRes);
        }
        break;

      case 403:
        console.error('Github Error', res);
        console.error(res.headers);
        return onRes(res);

      default:
        console.error('Unhandled status code', res);
        console.error(res.headers);
        return onRes(res);
    }
  });
}