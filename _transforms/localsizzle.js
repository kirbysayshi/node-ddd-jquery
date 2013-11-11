
var through = require('through')
  , esprima = require('esprima')
  , estraverse = require('estraverse')
  , escodegen = require('escodegen')

module.exports = function (file, sizzlePath) {

  var data = '';
  var stream = through(write, end);
  return stream;

  function write(buf) { data += buf }
  function end() {

    var ast = esprima.parse(data)

    estraverse.replace(ast, {

      leave: function(node) {
        // Handle any require('sizzle') statements.
        if (
          node.type === 'CallExpression'
          && node.callee.type === 'Identifier'
          && node.callee.name === 'require'
          && node.arguments[0]
          && node.arguments[0].type === 'Literal'
          && node.arguments[0].value === 'sizzle'
        ) {
          node.arguments[0].value = sizzlePath;
          node.arguments[0].raw = '\'' + sizzlePath + '\'';
        }
      }

    });

    var out = escodegen.generate(ast);
    stream.queue(out);
    stream.queue(null);
  }

}