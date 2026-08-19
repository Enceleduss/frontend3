const { createMacro } = require("babel-plugin-macros");
const fetch = require("sync-fetch");

module.exports = createMacro(liveExpressionMacro);

function liveExpressionMacro({ references, state, babel }) {
  console.log("[macro] started");
  const { default: defaultImport = [] } = references;

  for (const path of defaultImport) {
    const callExpression = path.parentPath;
    if (callExpression.type !== "CallExpression") {
      continue;
    }

    const [expressionNode, dependenciesNode] = callExpression.get("arguments");
    const expressionString = expressionNode.evaluate().value;

    // TODO: Send the expression to the backend and get an ID
    console.log(`[macro] Captured expression: ${expressionString}`);
    const exprId = getExpressionId(expressionString);
    //console.log(`[macro] Received expression ID: ${exprId}`);
    // Replace the expression string with the ID
    //callExpression
    // .get("arguments")[0]
    //.replaceWith(babel.types.stringLiteral(exprId));
    callExpression.replaceWith(babel.types.stringLiteral(exprId));
  }
}

function getExpressionId(expression) {
  // Placeholder: In a real scenario, this would be a unique ID from the backend
  console.log(`[macro] Sending expression to backend: ${expression}`);
  const id = `expr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const response = fetch("http://localhost:9046/api/register-expressions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([{ id: id, expression: expression }]),
  });
  console.log(`[macro] Backend response status: ${response.status}`);
  //Simulate a network call
  // const response = await fetch('http://localhost:8080/api/expressions', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ expression }),
  // });
  // const data = await response.json();
  // return data.id;

  return id;
}
