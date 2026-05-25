import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Application name is required'],
      unique: true,
      trim: true,
      lowercase: true, // enforce lowercase for consistency and easier routing
      validate: {
        validator: function (v) {
          // Reject any string containing whitespaces (spaces, tabs, newlines, etc.)
          return /^\S+$/.test(v);
        },
        message: props => `${props.value} is not a valid application name! Application names cannot contain whitespaces.`,
      },
    },
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Developer',
      required: [true, 'Owner developer reference is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;
