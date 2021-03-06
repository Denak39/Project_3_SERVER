const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImg: {
      type: String,
      default:
        "https://vignette.wikia.nocookie.net/simpsons/images/1/14/Ralph_Wiggum.png/revision/latest/top-crop/width/360/height/360?cb=20100704163100",
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    accountType: {
      type: String,
      enum: ["Student", "Trainer"],
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
