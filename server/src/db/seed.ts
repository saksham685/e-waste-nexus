import { db } from './database.js';

console.log('--- E-Waste Nexus Seed Script Initiated ---');
db.seedDefaultData(true);
console.log('--- Database forcefully reset & populated with enterprise records! ---');
process.exit(0);
