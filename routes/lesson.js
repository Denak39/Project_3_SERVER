const express = require("express");
const router = express.Router();
const Lesson = require("../models/Lesson");
const User = require("../models/User");
const uploader = require("../config/cloudinary");
const requireAuth = require("../middlewares/requireAuth"); // Route protection middleware : )

//lists all lessons
router.get("/", (req, res, next) => {
  Lesson.find({})
    .populate("trainerId") // Gives us the author's id (id_user) object document instead of just the id : )
    .then((itemDocuments) => {
      res.status(200).json(itemDocuments);
    })
    .catch(next); // cf app.js error handling middleware
  // same as below
  //.catch(error => next(error))
});
//create a lesson
router.post("/create", requireAuth, (req, res, next) => {
  const updateValues = { ...req.body };

  updateValues.trainerId = req.session.currentUser; // Retrieve the authors id from the session.

  Lesson.create(updateValues)
    .then((itemDocument) => {
      itemDocument
        .populate("trainerId")
        .execPopulate() // Populate on .create() does not work, but we can use populate() on the document once its created !
        .then((lesson) => {
          console.log("here");
          res.status(201).json(lesson); // send the populated document.
        })
        .catch(next);
    })
    .catch(next);
});

// specific lesson
router.get("/:id", (req, res, next) => {
  Lesson.findById(req.params.id).then((lessonDocument) => {
    res.status(200).json(lessonDocument);
  });
});

// Update one lesson
router.patch("/:id", requireAuth, (req, res, next) => {
  const lesson = { ...req.body };
  Lesson.findById(req.params.id)
    .then((lessonDocument) => {
      if (!lessonDocument)
        return res.status(404).json({ message: "Item not found" });
      if (lessonDocument.trainerId.toString() !== req.session.currentUser) {
        return res
          .status(403)
          .json({ message: "You are not allowed to update this document" });
      }

      Lesson.findByIdAndUpdate(req.params.id, lesson, { new: true })
        .populate("trainerId")
        .then((updatedDocument) => {
          return res.status(200).json(updatedDocument);
        })
        .catch(next);
    })
    .catch(next);
});
//Delete one lesson
router.delete("/:id", requireAuth, (req, res, next) => {
  Lesson.findById(req.params.id)
    .then((lessonDocument) => {
      if (!lessonDocument) {
        return res.status(404).json({ message: "Item not found" });
      }
      if (lessonDocument.trainerId.toString() !== req.session.currentUser) {
        return res.status(403).json({ message: "You can't delete this item" });
      }

      Lesson.findByIdAndDelete(req.params.id)
        .then(() => {
          return res.sendStatus(204);
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
