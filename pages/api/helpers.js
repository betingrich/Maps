import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) return reject({ error, stderr });
      resolve(stdout);
    });
  });
}

export async function createDeploymentDir(basePath, deploymentId) {
  const deploymentPath = path.join(basePath, deploymentId);
  await fs.promises.mkdir(deploymentPath, { recursive: true });
  return deploymentPath;
}

export function generateEnvFile(config) {
  return Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
}

export async function isPortAvailable(port) {
  const net = require('net');
  return new Promise(resolve => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port);
  });
}
