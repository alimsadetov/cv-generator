// scripts/combineSchema.js

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const modelsPath = path.join(__dirname, '../prisma/models');
const basePath = path.join(__dirname, '../prisma/schema-base.prisma');
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');

// Read the base schema
const baseSchema = fs.readFileSync(basePath, 'utf8');

// Read all model files
let modelsSchema = '';
fs.readdirSync(modelsPath).forEach((file) => {
  modelsSchema += fs.readFileSync(path.join(modelsPath, file), 'utf8') + '\n';
});

// Combine and write to schema.prisma
fs.writeFileSync(schemaPath, baseSchema + '\n' + modelsSchema);
console.log('Schema successfully combined!');
