/**
 * Gets system information (memory, CPU, etc.)
 * @returns {Promise<object>}
 */
export async function getSystemInfo() {
  const os = require('os');
  
  return {
    platform: os.platform(),
    arch: os.arch(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    cpus: os.cpus().length,
    loadavg: os.loadavg(),
    uptime: os.uptime()
  };
}

/**
 * Checks if a process is running
 * @param {string} processName 
 * @returns {Promise<boolean>}
 */
export async function isProcessRunning(processName) {
  try {
    const { stdout } = await executeCommand(`pgrep -f ${processName}`);
    return stdout.trim().length > 0;
  } catch {
    return false;
  }
}

/**
 * Gets the size of a directory
 * @param {string} dirPath 
 * @returns {Promise<number>} Size in bytes
 */
export async function getDirectorySize(dirPath) {
  const fs = require('fs').promises;
  const path = require('path');
  
  const files = await fs.readdir(dirPath);
  let size = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = await fs.stat(filePath);
    
    if (stat.isDirectory()) {
      size += await getDirectorySize(filePath);
    } else {
      size += stat.size;
    }
  }
  
  return size;
}

/**
 * Formats bytes to human-readable size
 * @param {number} bytes 
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
