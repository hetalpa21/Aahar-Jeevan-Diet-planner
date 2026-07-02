const fs = require('fs');
let content = fs.readFileSync('src/lib/api/database.functions.ts', 'utf8');
content = content.replace(/\.handler\(async \(\{ data: ([a-zA-Z0-9_]+) \}: \{ data: ([^\}]+) \}\)/g, '.validator((data: $2) => data).handler(async ({ data: $1 })');
content = content.replace(/\.handler\(async \(\{ data: \{ id, patch \} \}: \{ data: \{ id: string; patch: Partial\<([a-zA-Z0-9_]+)\> \} \}\)/g, '.validator((data: { id: string; patch: Partial<$1> }) => data).handler(async ({ data: { id, patch } })');
fs.writeFileSync('src/lib/api/database.functions.ts', content);
