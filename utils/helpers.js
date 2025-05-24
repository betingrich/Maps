// Client-side compatible helpers
export function generateDeploymentId() {
  return Math.random().toString(36).substring(2, 9) + 
         Date.now().toString(36).substring(4);
}

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function capitalize(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

export function getBotDisplayName(botId) {
  return botId
    .split('-')
    .map(word => capitalize(word))
    .join(' ');
}

export function formatEnvVars(config) {
  return Object.entries(config).map(([key, value]) => ({
    key,
    value: String(value),
    enabled: value !== '' && value !== 'false'
  }));
}

// Server-side helpers (for API routes only)
export const serverHelpers = {
  executeCommand: (command) => {
    const { exec } = require('child_process');
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) return reject({ error, stderr });
        resolve(stdout);
      });
    });
  },
  
  createDeploymentDir: async (basePath, deploymentId) => {
    const fs = require('fs').promises;
    const path = require('path');
    const deploymentPath = path.join(basePath, deploymentId);
    await fs.mkdir(deploymentPath, { recursive: true });
    return deploymentPath;
  },
  
  generateEnvFile: (config) => {
    return Object.entries(config)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
  },
  
  findAvailablePort: async (startingPort = 3000) => {
    const net = require('net');
    const isPortAvailable = (port) => new Promise(resolve => {
      const server = net.createServer();
      server.once('error', () => resolve(false));
      server.once('listening', () => {
        server.close(() => resolve(true));
      });
      server.listen(port);
    });
    
    let port = startingPort;
    while (port < 65535) {
      if (await isPortAvailable(port)) return port;
      port++;
    }
    throw new Error('No available ports found');
  }
};
