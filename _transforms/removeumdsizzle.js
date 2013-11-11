
var through = require('through')
  , esprima = require('esprima')
  , estraverse = require('estraverse')
  , escodegen = require('escodegen')

/**
 * Browserify transform, returning writeable/readable stream.
 * If the given path contains 'sizzle', remove the UMD guard to
 * prevent interference when running within a hybrid environment.
 * The guard is replaced with a simple `module.exports = Sizzle;`.
 *
 */
module.exports = function (file) {

  var data = '';
  var stream;

  if (file.indexOf('sizzle') === -1) {
    stream = through();
  } else {
    stream = through(write, end);
  }
  return stream;

  function write(buf) { data += buf }
  function end() {

    var ast = esprima.parse(data)

    estraverse.replace(ast, {

      enter: function(node) {
        if (
          node.type === 'IfStatement'
          && node.test.type === 'LogicalExpression'
          && node.test.operator === '&&'
          && node.test.left.type === 'BinaryExpression'
          && node.test.left.left
          && node.test.left.left.type === 'UnaryExpression'
          && node.test.left.left.operator === 'typeof'
          && node.test.left.left.argument
          && node.test.left.left.argument.name === 'define'
        ) {
          return {
            "type": "ExpressionStatement",
            "expression": {
              "type": "AssignmentExpression",
              "operator": "=",
              "left": {
                "type": "MemberExpression",
                "computed": false,
                "object": {
                  "type": "Identifier",
                  "name": "module"
                },
                "property": {
                  "type": "Identifier",
                  "name": "exports"
                }
              },
              "right": {
                "type": "Identifier",
                "name": "Sizzle"
              }
            }
          }
        }
      }

    });

    var out = escodegen.generate(ast);
    stream.queue(out);
    stream.queue(null);
  }

}