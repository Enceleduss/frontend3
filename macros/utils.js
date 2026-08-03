const crypto = require('crypto');

function generateExpressionId(expression) {
  const hash = crypto.createHash('sha256');
  hash.update(expression);
  return hash.digest('hex').slice(0, 16);
}

module.exports = { generateExpressionId };
