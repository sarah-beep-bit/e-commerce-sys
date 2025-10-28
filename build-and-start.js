import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const frontendDistPath = join(__dirname, 'frontend', 'dist');
const frontendNodeModules = join(__dirname, 'frontend', 'node_modules');

console.log('🚀 Starting E-Commerce System...\n');

// Function to run a command
function runCommand(command, args, cwd = __dirname) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    const proc = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with code ${code}`));
      } else {
        resolve();
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

async function buildAndStart() {
  try {
    // Check if frontend dependencies are installed
    if (!existsSync(frontendNodeModules)) {
      console.log('📦 Installing frontend dependencies...');
      await runCommand('npm', ['install'], join(__dirname, 'frontend'));
      console.log('✅ Frontend dependencies installed\n');
    }

    // Check if frontend is built
    if (!existsSync(frontendDistPath)) {
      console.log('🔨 Building frontend...');
      await runCommand('npm', ['run', 'build'], join(__dirname, 'frontend'));
      console.log('✅ Frontend built successfully\n');
    } else {
      console.log('✅ Frontend already built\n');
    }

    // Start the server
    console.log('🚀 Starting server...\n');
    const serverProc = spawn('node', ['backend/server.js'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true
    });

    serverProc.on('error', (err) => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

buildAndStart();
