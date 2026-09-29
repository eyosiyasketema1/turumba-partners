const fs = require('fs');
const cobe = fs.readFileSync('node_modules/cobe/dist/index.js', 'utf8');
console.log("Supports arcs?", cobe.includes("arcs") || cobe.includes("arcColor"));
console.log("Supports update?", cobe.includes("update("));
