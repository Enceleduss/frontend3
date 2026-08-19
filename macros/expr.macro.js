const { createMacro } = require("babel-plugin-macros");
const { execFileSync } = require("node:child_process");
const { generateExpressionId } = require("./utils");

const EXPRESSION_API_URL = "http://localhost:9046/register-expression";

function exprMacro({ references, state, babel }) {
  const { types: t } = babel;
  console.log(` started`);
  references.default.forEach((referencePath) => {
    if (referencePath.parentPath.isCallExpression()) {
      const callExpressionPath = referencePath.parentPath;
      const args = callExpressionPath.get("arguments");

      if (args.length !== 1) {
        throw new Error(
          `[expr.macro] expected one argument, but got ${args.length}`,
        );
      }

      const expressionNode = args[0].node;
      if (!t.isStringLiteral(expressionNode)) {
        throw new Error(`[expr.macro] argument must be a string literal.`);
      }

      const expression = expressionNode.value;
      const id = generateExpressionId(expression);

      registerExpression({ id, expression });

      // Replace the macro call with the generated ID
      callExpressionPath.replaceWith(t.stringLiteral(id));
    }
  });
}

function registerExpression(payload) {
  try {
    // Babel macros run synchronously, so a Promise-based fetch cannot be awaited
    // here. curl blocks until the request completes and exits non-zero for network
    // failures and HTTP 4xx/5xx responses.
    execFileSync(
      "curl",
      [
        "--fail",
        "--silent",
        "--show-error",
        "--request",
        "POST",
        "--header",
        "Content-Type: application/json",
        "--data-binary",
        "@-",
        EXPRESSION_API_URL,
      ],
      { input: JSON.stringify(payload), encoding: "utf8" },
    );
  } catch (error) {
    const detail = error.stderr?.trim() || error.message;
    throw new Error(
      `[expr.macro] could not register expression at ${EXPRESSION_API_URL}: ${detail}`,
    );
  }
}

module.exports = createMacro(exprMacro);
