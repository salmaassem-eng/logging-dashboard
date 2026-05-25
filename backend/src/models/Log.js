import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Log message is required'],
      trim: true,
    },
    level: {
      type: String,
      required: [true, 'Log level is required'],
      enum: {
        values: ['INFO', 'WARN', 'ERROR'],
        message: '{VALUE} is not a valid log level. Supported levels: INFO, WARN, ERROR',
      },
      uppercase: true, // convert levels to uppercase automatically
    },
    count: {
      type: Number,
      required: true,
      default: 1,
      min: [1, 'Count must be at least 1'],
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Log must belong to an application'],
    },
  },
  {
    timestamps: true, // Automatically provides createdAt and updatedAt
  }
);

// Optimize database queries with an index on application, message, and level
// This makes log deduplication (finding existing logs by message and level) extremely fast
logSchema.index({ application: 1, message: 1, level: 1 });

const Log = mongoose.model('Log', logSchema);

export default Log;
