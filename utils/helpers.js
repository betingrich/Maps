// Browser-compatible utility functions

/**
 * Generates a random deployment ID
 * @returns {string}
 */
export function generateDeploymentId() {
  return Math.random().toString(36).substring(2, 9) + 
         Date.now().toString(36).substring(4);
}

/**
 * Formats a timestamp for display
 * @param {string|Date} timestamp 
 * @returns {string}
 */
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

/**
 * Simulates a delay (for testing/development)
 * @param {number} ms 
 * @returns {Promise<void>}
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Capitalizes the first letter of each word
 * @param {string} str 
 * @returns {string}
 */
export function capitalize(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Converts a bot ID to display name
 * @param {string} botId 
 * @returns {string}
 */
export function getBotDisplayName(botId) {
  return botId
    .split('-')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Formats environment variables for display
 * @param {object} config 
 * @returns {array} Array of {key, value, enabled}
 */
export function formatEnvVars(config) {
  return Object.entries(config).map(([key, value]) => ({
    key,
    value: String(value),
    enabled: value !== '' && value !== 'false'
  }));
}

/**
 * Validates a GitHub repository URL
 * @param {string} url 
 * @returns {boolean}
 */
export function isValidGitHubRepo(url) {
  return /^https:\/\/github.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+(\/)?$/.test(url);
}

/**
 * Generates a .env file content from config (client-side version)
 * @param {object} config 
 * @returns {string}
 */
export function generateEnvFileContent(config) {
  return Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
}

/**
 * Checks if a string is a valid URL
 * @param {string} str 
 * @returns {boolean}
 */
export function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Truncates text with ellipsis
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export function truncate(text, maxLength = 50) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
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

/**
 * Creates a deep copy of an object
 * @param {object} obj 
 * @returns {object}
 */
export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Checks if two objects are equal (shallow comparison)
 * @param {object} obj1 
 * @param {object} obj2 
 * @returns {boolean}
 */
export function shallowEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  
  return true;
}

/**
 * Debounces a function
 * @param {function} func 
 * @param {number} wait 
 * @returns {function}
 */
export function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Throttles a function
 * @param {function} func 
 * @param {number} limit 
 * @returns {function}
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Generates a random hex color
 * @returns {string}
 */
export function randomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

/**
 * Converts a string to slug format
 * @param {string} str 
 * @returns {string}
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Checks if value is empty
 * @param {any} value 
 * @returns {boolean}
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
                             }
