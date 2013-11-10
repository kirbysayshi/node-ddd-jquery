#!/usr/bin/env node

var path = require('path')

var get = require('../_lib/getjquery')
  , transform = require('../_lib/transform')

get(onSource);
//var srcpath = path.join(__dirname, '..', '_jqsrc', 'jquery-jquery-1185427', 'src');
//console.log(srcpath);
//onSource(null, srcpath)

function onSource(err, srcpath) {
  if (err) {
    console.error(err);
    return process.exit(10);
  }

  transform(srcpath, path.join(__dirname, '../'), function(err) {
    if (err) {
      throw err;
    }
  });
}

