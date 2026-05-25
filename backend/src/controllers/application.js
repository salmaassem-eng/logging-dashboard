import Application from '../models/Application.js';
import Log from '../models/Log.js';

// @desc    Get all applications for the logged-in developer
// @route   GET /api/applications
// @access  Private
export const getApps = async (req, res, next) => {
  try {
    const apps = await Application.find({ developer: req.user.id });

    // For dashboard usability, let's fetch log summaries for each application in the list
    // This allows the front-end to display counts of total, warning, and error logs per application.
    const appsWithMetrics = await Promise.all(
      apps.map(async (app) => {
        const logs = await Log.find({ application: app._id });
        
        const totalLogs = logs.reduce((sum, l) => sum + l.count, 0);
        const warningCount = logs.filter(l => l.level === 'WARN').reduce((sum, l) => sum + l.count, 0);
        const errorCount = logs.filter(l => l.level === 'ERROR').reduce((sum, l) => sum + l.count, 0);
        const errorRate = totalLogs > 0 ? parseFloat(((errorCount / totalLogs) * 100).toFixed(1)) : 0;

        return {
          id: app._id,
          name: app.name,
          platform: 'Universal/API', // default platform description
          description: `Logs workspace for ${app.name} service.`,
          apiKey: req.user.apiKey, // developer's key used globally
          createdAt: app.createdAt,
          metrics: {
            totalLogs,
            errorRate,
            warningCount,
            errorCount,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      count: apps.length,
      data: appsWithMetrics,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single application by name
// @route   GET /api/applications/:name
// @access  Private
export const getAppByName = async (req, res, next) => {
  const appName = req.params.name;

  try {
    const app = await Application.findOne({ name: appName.toLowerCase() });

    if (!app) {
      return res.status(404).json({
        success: false,
        message: `Application '${appName}' not found`,
      });
    }

    // Verify ownership
    if (app.developer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not the owner of this application',
      });
    }

    // Return the app configuration
    res.status(200).json({
      success: true,
      data: {
        id: app._id,
        name: app.name,
        createdAt: app.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private
export const createApp = async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an application name',
    });
  }

  try {
    // Create the application (Model validators will check for spaces and database uniqueness)
    const app = await Application.create({
      name: name.toLowerCase(),
      developer: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: {
        id: app._id,
        name: app.name,
        createdAt: app.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete application and cascade delete all its logs
// @route   DELETE /api/applications/:name
// @access  Private
export const deleteApp = async (req, res, next) => {
  const appName = req.params.name;

  try {
    const app = await Application.findOne({ name: appName.toLowerCase() });

    if (!app) {
      return res.status(404).json({
        success: false,
        message: `Application '${appName}' not found`,
      });
    }

    // Verify ownership
    if (app.developer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not the owner of this application',
      });
    }

    // 1. Delete associated logs
    await Log.deleteMany({ application: app._id });

    // 2. Delete the application
    await Application.deleteOne({ _id: app._id });

    res.status(200).json({
      success: true,
      message: `Application '${app.name}' and all its logs have been deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
