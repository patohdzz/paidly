import mongoose from "mongoose";

export const SERVICE_CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Drywall & Painting",
  "Carpentry",
  "General Handyman",
];

export const SERVICE_UNITS = ["flat", "hr", "day"];

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      minlength: [2, "Service name must be at least 2 characters"],
      maxlength: [80, "Service name must be 80 characters or less"],
      unique: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: { values: SERVICE_CATEGORIES, message: "Invalid category" },
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      enum: { values: SERVICE_UNITS, message: "Unit must be flat, hr, or day" },
      default: "flat",
    },
    rate: {
      type: Number,
      required: [true, "Rate is required"],
      min: [0.01, "Rate must be greater than 0"],
    },
    durationMinutes: {
      type: Number,
      required: [true, "Duration is required"],
      min: [15, "Duration must be at least 15 minutes"],
      max: [480, "Duration must be 8 hours or less"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [300, "Description must be 300 characters or less"],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        delete ret._id;
        return ret;
      },
    },
  }
);

// Supports "list active services in a category" (the Browse Services page).
serviceSchema.index({ active: 1, category: 1 });

export const Service = mongoose.model("Service", serviceSchema);