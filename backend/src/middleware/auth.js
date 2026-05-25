import jwt from 'jsonwebtoken';
import Developer from '../models/Developer.js';
import Application from '../models/Application.js';

// Protect standard developer dashboard routes using JWT session
export const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in cookies first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Check for token in Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No authentication token provided',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get developer from database, excluding password field
    const user = await Developer.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: User no longer exists',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Invalid token signature or token expired',
    });
  }
};

// Validate API Key owner matches the Application owner for log ingestion
export const verifyIngestionKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['X-API-KEY'];
  const appName = req.params.name;

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'Ingestion failed: Missing x-api-key authentication header',
    });
  }

  if (!appName) {
    return res.status(400).json({
      success: false,
      message: 'Ingestion failed: Missing target application name parameter',
    });
  }

  try {
    // 1. Find developer owning the API Key
    const developer = await Developer.findOne({ apiKey });
    if (!developer) {
      return res.status(401).json({
        success: false,
        message: 'Ingestion failed: Invalid API key',
      });
    }

    // 2. Find application by name (lowercase to match storage)
    const application = await Application.findOne({ name: appName.toLowerCase() });
    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Ingestion failed: Application '${appName}' does not exist`,
      });
    }

    // 3. Verify that the developer owning this API Key owns this application
    if (application.developer.toString() !== developer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Ingestion failed: API key owner is not authorized to log to this application',
      });
    }

    // Attach both developer and application context to request
    req.ingestionDeveloper = developer;
    req.ingestionApp = application;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Ingestion error: ${error.message}`,
    });
  }
};
