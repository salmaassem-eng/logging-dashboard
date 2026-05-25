// Private closure config variables
const config = {
  apiKey: null,
  appName: null,
  serverUrl: 'http://localhost:5000', // default port of LogVault Server
};

/**
 * Initialize the LogVault Client SDK.
 * @param {string} apiKey - The developer API key from LogVault Dashboard.
 * @param {string} appName - The unique application name registered in the workspace (no spaces).
 * @param {string} [serverUrl] - Optional custom ingestion server URL (default: http://localhost:5000).
 */
export const init = (apiKey, appName, serverUrl) => {
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
    throw new Error('LogVault SDK Error: A valid string API key is required to initialize.');
  }

  if (!appName || typeof appName !== 'string' || !appName.trim()) {
    throw new Error('LogVault SDK Error: A valid application name is required to initialize.');
  }

  if (/\s/.test(appName)) {
    throw new Error('LogVault SDK Error: The application name cannot contain whitespaces.');
  }

  config.apiKey = apiKey.trim();
  config.appName = appName.trim().toLowerCase(); // lowercased to match Mongoose schema validation

  if (serverUrl && typeof serverUrl === 'string' && serverUrl.trim()) {
    // Strip trailing slash if present
    config.serverUrl = serverUrl.trim().replace(/\/$/, '');
  }
};

/**
 * Send a log event to LogVault Ingestion endpoint.
 * @param {string} message - The log description/details.
 * @param {string} level - Severity level: 'INFO' | 'WARN' | 'ERROR'.
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const log = async (message, level) => {
  if (!config.apiKey || !config.appName) {
    throw new Error('LogVault SDK Error: SDK has not been initialized. You must invoke init(apiKey, appName) before logging.');
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new Error('LogVault SDK Error: Log message is required and must be a non-empty string.');
  }

  if (!level || typeof level !== 'string') {
    throw new Error('LogVault SDK Error: Log level is required (INFO, WARN, ERROR).');
  }

  const upperLevel = level.trim().toUpperCase();
  if (!['INFO', 'WARN', 'ERROR'].includes(upperLevel)) {
    throw new Error(`LogVault SDK Error: Invalid log level '${level}'. Supported levels are: INFO, WARN, ERROR`);
  }

  const url = `${config.serverUrl}/api/applications/${config.appName}/logs`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
      },
      body: JSON.stringify({
        message: message.trim(),
        level: upperLevel,
      }),
    });

    const body = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: body.message || `HTTP Error ${response.status}: Ingestion rejected.`,
      };
    }

    return {
      success: true,
      data: body.data,
    };
  } catch (err) {
    return {
      success: false,
      error: `Network/Ingestion connection error: ${err.message}`,
    };
  }
};

/**
 * Helper to log an INFO level event.
 * @param {string} message 
 * @returns {Promise}
 */
export const info = (message) => log(message, 'INFO');

/**
 * Helper to log a WARN level event.
 * @param {string} message 
 * @returns {Promise}
 */
export const warn = (message) => log(message, 'WARN');

/**
 * Helper to log an ERROR level event.
 * @param {string} message 
 * @returns {Promise}
 */
export const error = (message) => log(message, 'ERROR');

// Default export wrapper
const LogVault = {
  init,
  log,
  info,
  warn,
  error,
};

export default LogVault;
