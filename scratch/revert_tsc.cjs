const fs = require('fs');
let content = fs.readFileSync('src/lib/api/database.functions.ts', 'utf8');
content = content.replace(/\.validator\(\(data: ([^\)]+)\) => data\)\.handler\(async \(\{ data: ([a-zA-Z0-9_]+) \}\)/g, '.handler(async ({ data: $2 }: { data: $1 })');
content = content.replace(/\.validator\(\(data: \{ id: string; patch: Partial\<([a-zA-Z0-9_]+)\> \}\) => data\)\.handler\(async \(\{ data: \{ id, patch \} \}\)/g, '.handler(async ({ data: { id, patch } }: { data: { id: string; patch: Partial<$1> } })');
fs.writeFileSync('src/lib/api/database.functions.ts', content);
