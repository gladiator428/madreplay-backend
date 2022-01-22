const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const EmailModel = require("../../models/emails/Emails");

/**
 * Get published emails
 */
router.get("/", async (req, res) => {
  try {
    const emails = await EmailModel.find();
    return res.json(emails);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error!" });
  }
});

/**
 * Publish email
 */
router.post("/publish", async (req, res) => {
  try {
    const email = await EmailModel.findOne({ e_id: req.body.e_id });
    if (email) {
      return res
        .status(400)
        .json({ error: "You've already published this email." });
    }

    const newEmail = new EmailModel(req.body);

    await newEmail.save();
    return res.json({ success: "An Email is published successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Server error!" });
  }
});

/**
 * get published email by id
 */
router.get("/:id", async (req, res) => {
  try {
    const email = await EmailModel.findById(req.params.id);
    return res.json(email);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error!" });
  }
});

/**
 * like the published email
 */
router.post("/like", async (req, res) => {
  try {
    const { email, id } = req.body;
    console.log(email, id);
    const emailData = await EmailModel.findById(mongoose.Types.ObjectId(id));
    if (emailData.likes.filter((item) => item === email).length > 0) {
      const removeIndex = emailData.likes.map((like) => like).indexOf(email);
      emailData.likes.splice(removeIndex, 1);
    } else {
      emailData.likes.push(email);
      if (emailData.unlikes.filter((item) => item === email).length > 0) {
        const removeIndex = emailData.unlikes
          .map((like) => like)
          .indexOf(email);
        emailData.unlikes.splice(removeIndex, 1);
      }
    }

    await emailData.save();

    return res.json(emailData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error!" });
  }
});

/**
 * unlike the published email
 */
router.post("/unlike", async (req, res) => {
  const { email, id } = req.body;
  try {
    const emailData = await EmailModel.findById(mongoose.Types.ObjectId(id));
    if (emailData.unlikes.filter((item) => item === email).length > 0) {
      const removeIndex = emailData.likes.map((like) => like).indexOf(email);
      emailData.unlikes.splice(removeIndex, 1);
    } else {
      emailData.unlikes.push(email);
      if (emailData.likes.filter((item) => item === email).length > 0) {
        const removeIndex = emailData.likes.map((like) => like).indexOf(email);
        emailData.likes.splice(removeIndex, 1);
      }
    }

    await emailData.save();

    return res.json(emailData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error!" });
  }
});

module.exports = router;
