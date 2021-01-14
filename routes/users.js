const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/me", (req, res, next) => {
  User.findById(req.session.currentUser).then((items) => {
    res.status(200).json(items);
  });
});

router.patch("/me", (req, res, next) => {
  User.findByIdAndUpdate(req.session.currentUser, req.body, { new: true })
    .then((items) => {
      res.status(201).send(items);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
