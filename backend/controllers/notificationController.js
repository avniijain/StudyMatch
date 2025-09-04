import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Room from '../models/Room.js';

const sendNotification = async (req, res) => {
  try {
    const { receiverId, roomId } = req.body;

    const sender = await User.findById(req.user._id);
    if (!sender) return res.status(404).json({ msg: 'Sender not found' });

    const notification = await Notification.create({
      sender: sender._id,
      receiver: receiverId,
      type: 'room_request',
      room: roomId,
      message: `${sender.name} wants to join your room`
    });

    res.status(201).json(notification);
  } catch (err) {
    console.error("Send notification failed:", err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiver: req.user._id,
      status: "pending"
    })
      .populate('sender', 'name')
      .populate('room', 'name')
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error("Get notifications failed:", err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ msg: 'Notification marked as read' });
  } catch (err) {
    console.error("Mark as read failed:", err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const sendJoinRequest = async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findById(roomId).populate('host', 'name');

    if (!room) return res.status(404).json({ msg: 'Room not found' });

    // Prevent duplicate requests
    const existing = await Notification.findOne({
      sender: req.user._id,
      receiver: room.host._id,
      type: 'room_request',
      room: roomId,
      status: 'pending'
    });
    if (existing) return res.status(400).json({ msg: 'Request already sent' });

    const notification = await Notification.create({
      receiver: room.host._id,
      sender: req.user._id,
      room: roomId,
      type: 'room_request',
      message: `${req.user.name} requested to join your room`
    });

    const populatedNotification = await Notification.findById(notification._id)
      .populate('sender', 'name')       
      .populate('room', 'roomName');   

    // Emit the populated object
    req.io.to(room.host._id.toString()).emit('notification:new', populatedNotification);

    res.status(201).json(notification);
  } catch (err) {
    console.error('Send request failed:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Accept request
const acceptJoinRequest = async (req, res) => {
  try {
    const { id } = req.params; // notification ID
    const notification = await Notification.findById(id).populate('room');

    if (!notification) return res.status(404).json({ msg: 'Notification not found' });
    if (notification.status !== 'pending')
      return res.status(400).json({ msg: 'Request already handled' });

    // Only room host can accept
    if (notification.receiver.toString() !== req.user._id.toString())
      return res.status(403).json({ msg: 'Not authorized' });

    // Add sender to participants
    const room = await Room.findById(notification.room._id);
    if (!room.participants.includes(notification.sender)) {
      room.participants.push(notification.sender);
      await room.save();
    }

    // Update notification status
    notification.status = 'accepted';
    await notification.save();

    // Emit update to sender
    req.io.to(notification.sender.toString()).emit('notification:update', {
      id: notification._id.toString(),
      status: 'accepted',
      receiver: notification.sender.toString()
    });

    res.status(200).json({ msg: 'Request accepted', room });
  } catch (err) {
    console.error('Accept request failed:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Reject request
const rejectJoinRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) return res.status(404).json({ msg: 'Notification not found' });
    if (notification.status !== 'pending')
      return res.status(400).json({ msg: 'Request already handled' });

    if (notification.receiver.toString() !== req.user._id.toString())
      return res.status(403).json({ msg: 'Not authorized' });

    notification.status = 'rejected';
    await notification.save();

    req.io.to(notification.sender.toString()).emit('notification:update', {
      id: notification._id.toString(),
      status: 'rejected',
      receiver: notification.sender.toString()
    });

    res.status(200).json({ msg: 'Request rejected' });
  } catch (err) {
    console.error('Reject request failed:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export default { sendNotification, getNotifications, markAsRead, sendJoinRequest, rejectJoinRequest, acceptJoinRequest };