const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");
const uploader = require("../config/cloudinary");
const requireAuth = require("../middlewares/requireAuth"); // Route protection middleware : )

//list all events
router.get("/", (req, res, next) => {
  Event.find({})
    .populate("trainerId") // Gives us the author's id (id_user) object document instead of just the id : )
    .then((eventDocuments) => {
      res.status(200).json(eventDocuments);
    })
    .catch(next); // cf app.js error handling middleware
  // same as below
  //.catch(error => next(error))
});

//create an event
router.post("/create", requireAuth, (req, res, next) => {
  const updateValues = { ...req.body };

  updateValues.trainerId = req.session.currentUser; // Retrieve the authors id from the session.

  Event.create(updateValues)
    .then((eventDocument) => {
      eventDocument
        .populate("event")
        .execPopulate() // Populate on .create() does not work, but we can use populate() on the document once its created !
        .then((event) => {
          console.log("here");
          res.status(201).json(event); // send the populated document.
        })
        .catch(next);
    })
    .catch(next);
});

//specific event 
router.get("/:id", (req, res, next) => {
  Event.findById(req.params.id).then((eventDocument) => {
    res.status(200).json(eventDocument);
  });
});

//update one event
router.patch(
  "/:id",
  requireAuth,
  (req, res, next) => {
    const event = { ...req.body };

    Event.findById(req.params.id)
      .then((eventDocument) => {
        if (!eventDocument)
          return res.status(404).json({ message: "Event not found" });
        if (eventDocument.trainerId.toString() !== req.session.currentUser) {
          return res
            .status(403)
            .json({ message: "You are not allowed to update this document" });
        }

        Event.findByIdAndUpdate(req.params.id, event, { new: true })
          .populate("trainerId")
          .then((updatedDocument) => {
            return res.status(200).json(updatedDocument);
          })
          .catch(next);
      })
      .catch(next);
  }
);

//delete one event
router.delete("/:id", requireAuth, (req, res, next) => {
  Event.findById(req.params.id)
    .then((eventDocument) => {
      if (!eventDocument) {
        return res.status(404).json({ message: "Event not found" });
      }
      if (eventDocument.trainerId.toString() !== req.session.currentUser) {
        return res.status(403).json({ message: "You can't delete this event" });
      }

      Event.findByIdAndDelete(req.params.id)
        .then(() => {
          return res.sendStatus(204);
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;

