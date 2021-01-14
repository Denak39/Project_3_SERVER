const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    name: String,
    category: { type: String, enum: ["TBD", "TBD"] },
    description: String,
    date: String,
    link: String,
    trainerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    spots: Number,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
