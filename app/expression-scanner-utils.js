
import { createHash } from 'crypto';

/**
 * @typedef {object} Expression
 * @property {string} id
 * @property {string} expression
 */

/**
 * Creates a stable, unique ID for an expression string.
 * This can be used in both Node.js (build-time) and browser environments.
 * @param {string} expression
 * @returns {Promise<string>}
 */
export async function generateExpressionId(expression) {
  const encoder = new TextEncoder();
  const data = encoder.encode(expression);
  let hashBuffer;

  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    // Browser environment
    hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  } else {
    // Node.js environment
    const hash = createHash('sha256').update(data).digest();
    hashBuffer = hash.buffer;
  }
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  // Convert buffer to hex string, and shorten it for convenience
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.substring(0, 16);
}

// The following functions are intended for use in the build script (Node.js environment)

export const EXPRESSION_REGISTRY_FILE = 'expression-registry.json';

/**
 * Scans file content for <ReactiveValue /> components and extracts expressions.
 * @param {string} fileContent
 * @returns {Expression[]}
 */
export function scanFileForExpressions(fileContent) {
  /** @type {Expression[]} */
  const expressions = [];
  // This regex looks for <ReactiveValue expression={`...`} />
  const regex = /<ReactiveValue\s+expression=\{`([^`]+)`\}\s*\/>/g;
  let match;

  while ((match = regex.exec(fileContent)) !== null) {
    const rawExpression = match[1];
    expressions.push({
      id: '', // ID will be generated later during registry update
      expression: rawExpression,
    });
  }

  return expressions;
}

/**
 * Updates the expression registry file with new, unique expressions.
 * @param {Expression[]} expressions
 * @returns {Promise<void>}
 */
export async function updateRegistry(expressions) {
  const fs = await import('fs/promises');
  /** @type {Expression[]} */
  let registry = [];
  try {
    const fileContent = await fs.readFile(EXPRESSION_REGISTRY_FILE, 'utf-8');
    registry = JSON.parse(fileContent);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      // Ignore not found error (registry will be created), but throw others.
      throw error;
    }
  }

  const newExpressions = await Promise.all(
    expressions.map(async (expr) => {
      const id = await generateExpressionId(expr.expression);
      // Add if the expression isn't already in the registry
      if (!registry.some((e) => e.expression === expr.expression)) {
        return { ...expr, id };
      }
      return null;
    })
  );

  const filteredNewExpressions = newExpressions.filter(
    (expr) => expr !== null
  );

  if (filteredNewExpressions.length > 0) {
    const updatedRegistry = [...registry, ...filteredNewExpressions];
    await fs.writeFile(
      EXPRESSION_REGISTRY_FILE,
      JSON.stringify(updatedRegistry, null, 2)
    );
  }
}
