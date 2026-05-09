const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log("Running npm run build in client directory...");
  const output = execSync('npm run build', { cwd: './client', encoding: 'utf-8' });
  fs.writeFileSync('build-log.txt', output);
  console.log("Build successful.");
} catch (error) {
  fs.writeFileSync('build-error.txt', error.stdout + '\n\n' + error.stderr);
  console.log("Build failed. Error logged to build-error.txt");
}
