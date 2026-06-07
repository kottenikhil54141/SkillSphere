const Notification = require("../models/Notification");

const createNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;

    const notification = await Notification.create({
      user: userId,
      message,
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    notification.read = true;
    await notification.save();

    res.json({ message: "Marked as read", notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createNotification, getMyNotifications, markAsRead };