const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
  name: String,
  category: { type: String, enum: ["TBD", "TBD"] },
  difficulty: String,
  content: String,
  likes: Number,
  trainerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }, //lesson.find
},
  {timestamps: { createdAt: "created_at", updatedAt: "updated_at" }}
);

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
