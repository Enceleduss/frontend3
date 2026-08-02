
import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';
import {
  scanFileForExpressions,
  updateRegistry,
} from './expression-scanner-utils.ts';

async function main() {
  console.log('Scanning components for expressions to build registry...');

  const appDir = path.join(process.cwd(), 'app');
  const files = await glob('**/*.tsx', { cwd: appDir });

  let allExpressions = [];

  for (const file of files) {
    const filePath = path.join(appDir, file);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const expressions = scanFileForExpressions(content);
      if (expressions.length > 0) {
        console.log(`Found ${expressions.length} expressions in ${file}`);
        allExpressions.push(...expressions);
      }
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }

  if (allExpressions.length > 0) {
    await updateRegistry(allExpressions);
    console.log('Expression registry updated successfully.');
  } else {
    console.log('No expressions found. Registry not updated.');
  }
}

main().catch((err) => {
  console.error(
    'An unexpected error occurred while generating the expression registry:',
    err
  );
  process.exit(1);
});
