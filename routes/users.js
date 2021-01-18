const express = require("express");
const router = express.Router();
const User = require("../models/User");
const uploader = require("../config/cloudinary");
const requireAuth = require("../middlewares/requireAuth"); // Route protection middleware : )
const Lesson = require("../models/Lesson");
const Event = require("../models/Event");

router.get("/", function (req, res, next) {
  Users.find({})
    .populate("id_user")
    .then((userDocuments) => {
      res.status(200).json(users);
    });
});

router.get("/me", (req, res, next) => {
  User.findById(req.session.currentUser).then((items) => {
    res.status(200).json(items);
  });
});

router.patch(
  "/me",
  requireAuth,
  uploader.single("profileImg"),
  (req, res, next) => {
    // If no file is sent, req.file is undefined, leading to an error when trying to
    // acces req.file.path (undefined.path) => Cannot read property path of undefined.
    if (req.file) {
      req.body.profileImg = req.file.path;
    }
    User.findByIdAndUpdate(req.session.currentUser, req.body, { new: true })
      .then((items) => {
        res.status(201).send(items);
      })
      .catch((error) => {
        console.log(error);
      });
  }
);

// current session user lesson list
router.get("/me/lessons", requireAuth, (req, res, next) => {
  const currentUserId = req.session.currentUser; // We retrieve the users id from the session.

  // And then get all the items matching the id_user field that matches the logged in users id.
  Lesson.find({ trainerId: currentUserId })
    .then((itemDocuments) => {
      res.status(200).json(itemDocuments);
    })
    .catch(next);
});

// current session user event list
router.get("/me/events", requireAuth, (req, res, next) => {
  const currentUserId = req.session.currentUser;
  Event.find({ trainerId: currentUserId })
    .then((itemDocuments) => {
      res.status(200).json(itemDocuments);
    })
    .catch(next);
});

//get lessons for a specific trainer
router.get("/:id/lessons", requireAuth, (req, res, next) => {
  const trainerId = req.params.id;
  Lesson.find({ trainerId })
    .then((itemDocuments) => {
      res.status(200).json(itemDocuments);
    })
    .catch(next);
});

// get events for a specific trainer
router.get("/:id/events", requireAuth, (req, res, next) => {
  const trainerId = req.params.id;
  Event.findById({ trainerId })
    .then((itemDocuments) => {
      res.status(200).json(itemDocuments);
    })
    .catch(next);
});

module.exports = router;
