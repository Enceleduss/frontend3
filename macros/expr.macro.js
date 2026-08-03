const { createMacro } = require('babel-plugin-macros');
const { generateExpressionId } = require('./utils');
const fetch = require('node-fetch');

function exprMacro({ references, state, babel }) {
  const { types: t } = babel;

  references.default.forEach(referencePath => {
    if (referencePath.parentPath.isCallExpression()) {
      const callExpressionPath = referencePath.parentPath;
      const args = callExpressionPath.get('arguments');

      if (args.length !== 1) {
        throw new Error(`[expr.macro] expected one argument, but got ${args.length}`);
      }

      const expressionNode = args[0].node;
      if (!t.isStringLiteral(expressionNode)) {
        throw new Error(`[expr.macro] argument must be a string literal.`);
      }

      const expression = expressionNode.value;
      const id = generateExpressionId(expression);

      // Register the expression with the backend
      fetch('http://localhost:8080/api/register-expression', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, expression }),
      }).catch(error => {
        console.error(`[expr.macro] failed to register expression: ${error.message}`);
      });

      // Replace the macro call with the generated ID
      callExpressionPath.replaceWith(t.stringLiteral(id));
    }
  });
}

module.exports = createMacro(exprMacro);
