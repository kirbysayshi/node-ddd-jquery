#!/usr/bin/env node

var path = require('path')

var get = require('../_lib/getjquery')
  , transform = require('../_lib/transform')

get(function(err, srcpath) {
  if (err) {
    console.error(err);
    return process.exit(10);
  }

  //var srcpath = path.join(__dirname, '..', '_jqsrc', 'jquery-jquery-1185427', 'src');
  //console.log(srcpath);

  transform(srcpath, path.join(__dirname, '../'), function(err) {
    if (err) {
      throw err;
    }
  });
})