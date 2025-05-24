/**
 * Validates the bot configuration against the specific bot's requirements
 * @param {object} config 
 * @param {string} botId 
 * @returns {Promise<{valid: boolean, errors?: object}>}
 */
export async function validateBotSpecificConfig(config, botId) {
  const bot = getBotById(botId);
  if (!bot) {
    return { valid: false, errors: { botId: 'Invalid bot ID' } };
  }

  // Check required features for this bot
  const errors = {};
  
  // Example: Demon Slayer requires AUTOLIKE_STATUS
  if (botId === 'demon-slayer' && config.AUTOLIKE_STATUS !== 'true') {
    errors.AUTOLIKE_STATUS = 'Demon Slayer requires Auto Like Status to be enabled';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined
  };
}

/**
 * Validates the deployment environment
 * @returns {Promise<{valid: boolean, errors?: object}>}
 */
export async function validateDeploymentEnvironment() {
  const errors = {};
  
  // Check required commands are available
  try {
    await executeCommand('git --version');
  } catch {
    errors.git = 'Git is required but not installed';
  }

  try {
    await executeCommand('node --version');
  } catch {
    errors.node = 'Node.js is required but not installed';
  }

  try {
    await executeCommand('npm --version');
  } catch {
    errors.npm = 'NPM is required but not installed';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined
  };
}
