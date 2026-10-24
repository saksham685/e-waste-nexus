/**
 * E-Waste Nexus - Pure Node.js Launcher
 * 
 * Run with:
 *   node server.js
 * 
 * Serves both the REST APIs and the 3D Web UI on http://localhost:5000
 */

const path = require('path');
const fs = require('fs');

// Verify Node.js version
console.log('---------------------------------------------------------');
console.log('🌱 Starting E-Waste Nexus with Pure Node.js (' + process.version + ')');
console.log('---------------------------------------------------------');

// Check if server/dist exists, if not execute server directly via tsx/node
const serverDist = path.join(__dirname, 'server', 'dist', 'server.js');

if (fs.existsSync(serverDist)) {
  // Launch compiled Node.js backend
  process.chdir(path.join(__dirname, 'server'));
  require(serverDist);
} else {
  console.log('Compiling TypeScript server or starting development watcher...');
  const { spawn } = require('child_process');
  const child = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });
  child.on('exit', (code) => process.exit(code));
}
