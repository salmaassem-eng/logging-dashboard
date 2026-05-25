import Log from '../models/Log.js';
import Application from '../models/Application.js';

// @desc    Post a log event to an application (Ingestion)
// @route   POST /api/applications/:name/logs
// @access  Private (Validated via Developer API Key header)
export const postLog = async (req, res, next) => {
  const { message, level } = req.body;
  const app = req.ingestionApp; // set by verifyIngestionKey middleware

  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Ingestion failed: Log message is required',
    });
  }

  if (!level) {
    return res.status(400).json({
      success: false,
      message: 'Ingestion failed: Log level is required (INFO, WARN, ERROR)',
    });
  }

  const upperLevel = level.toUpperCase();
  if (!['INFO', 'WARN', 'ERROR'].includes(upperLevel)) {
    return res.status(400).json({
      success: false,
      message: `Ingestion failed: '${level}' is not a valid log level. Must be INFO, WARN, or ERROR`,
    });
  }

  try {
    // Check if an identical log (same app, message, and level) already exists
    let log = await Log.findOne({
      application: app._id,
      message: message.trim(),
      level: upperLevel,
    });

    if (log) {
      // Deduplicate: increment count and let mongoose update timestamps
      log.count += 1;
      await log.save();
    } else {
      // Create new log document
      log = await Log.create({
        message: message.trim(),
        level: upperLevel,
        count: 1,
        application: app._id,
      });
    }

    res.status(201).json({
      success: true,
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all logs of an application (with Sorting, Pagination, Filtering)
// @route   GET /api/applications/:name/logs
// @access  Private (Validated via Developer JWT session)
export const getLogs = async (req, res, next) => {
  const appName = req.params.name;
  
  try {
    // 1. Resolve application and verify ownership
    const app = await Application.findOne({ name: appName.toLowerCase() });
    if (!app) {
      return res.status(404).json({
        success: false,
        message: `Application '${appName}' not found`,
      });
    }

    if (app.developer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not own this application',
      });
    }

    // 2. Build filtration query
    const filterQuery = { application: app._id };

    // Filter by level
    if (req.query.level && req.query.level !== 'ALL') {
      filterQuery.level = req.query.level.toUpperCase();
    }

    // Filter by search query (message case-insensitive regex)
    if (req.query.search) {
      filterQuery.message = { $regex: req.query.search, $options: 'i' };
    }

    // 3. Build sorting query
    let sortQuery = { updatedAt: -1 }; // default: most recent logs (updatedAt captures count increments)
    if (req.query.sort === 'occurred') {
      sortQuery = { count: -1 }; // highest count
    } else if (req.query.sort === 'recent') {
      sortQuery = { updatedAt: -1 };
    }

    // 4. Pagination math
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // 5. Execute DB queries concurrently
    const [logs, totalFilteredLogsCount, allAppLogs] = await Promise.all([
      Log.find(filterQuery)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),
      Log.countDocuments(filterQuery),
      Log.find({ application: app._id }), // fetch all to calculate live application aggregate metrics
    ]);

    // 6. Calculate total aggregate metrics for the dashboard charts
    const totalLogsCount = allAppLogs.reduce((sum, l) => sum + l.count, 0);
    const infoCount = allAppLogs.filter(l => l.level === 'INFO').reduce((sum, l) => sum + l.count, 0);
    const warningCount = allAppLogs.filter(l => l.level === 'WARN').reduce((sum, l) => sum + l.count, 0);
    const errorCount = allAppLogs.filter(l => l.level === 'ERROR').reduce((sum, l) => sum + l.count, 0);
    const errorRate = totalLogsCount > 0 ? parseFloat(((errorCount / totalLogsCount) * 100).toFixed(1)) : 0;

    res.status(200).json({
      success: true,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalFilteredLogsCount / limit),
        totalLogs: totalFilteredLogsCount,
      },
      metrics: {
        totalLogs: totalLogsCount,
        errorRate,
        infoCount,
        warningCount,
        errorCount,
      },
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};
