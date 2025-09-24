// src/controllers/notificationController.ts
import { Request, Response, NextFunction } from "express";
import Notification from "../models/Notification"; // Your Mongoose model
import { emitNotificationUpdate } from "../socket";

// GET: list of notifications
export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

// POST: create new notification and emit via socket
export const createNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = await Notification.create(req.body);

    // Emit real-time update
    emitNotificationUpdate(notification);

    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
};
