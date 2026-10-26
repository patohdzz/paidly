import mongoose from "mongoose";

export const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled"];

const bookingSchema = new mongoose.Schema(
  {
    // Who booked (from the login token, never from the request body)
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },

    // Which service + a snapshot of it at booking time
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    serviceName: { type: String, required: true },
    unit: { type: String, required: true },
    rate: { type: Number, required: true, min: 0 },
    durationMinutes: { type: Number, required: true, min: 15 },

    // When (stored in UTC). endsAt = scheduledAt + durationMinutes
    scheduledAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },

    address: {
      type: String,
      required: [true, "Service address is required"],
      trim: true,
      minlength: [5, "Address must be at least 5 characters"],
      maxlength: [200, "Address must be 200 characters or less"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes must be 500 characters or less"],
      default: "",
    },
    status: {
      type: String,
      enum: { values: BOOKING_STATUSES, message: "Invalid status" },
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        ret.userId = ret.user?.toString();
        ret.serviceId = ret.service?.toString();
        delete ret.user;
        delete ret.service;
        delete ret._id;
        return ret;
      },
    },
  }
);

// "My bookings" page: one customer's bookings by date
bookingSchema.index({ user: 1, scheduledAt: 1 });
// Admin list by status + the double-booking check
bookingSchema.index({ status: 1, scheduledAt: 1 });

export const Booking = mongoose.model("Booking", bookingSchema);