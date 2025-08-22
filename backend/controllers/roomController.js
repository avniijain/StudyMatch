import User from '../models/User.js';
import Room from '../models/Room.js';
import crypto from 'crypto';
import { activeRooms, updateSuggestedRoomsForAll } from '../socket.js';

const createRoom = async (req, res) => {
    const { type, subject, roomName } = req.body;

    try {
        const uniqueId = crypto.randomBytes(6).toString('hex');
        const jitsiLink = `https://meet.jit.si/studymatch-${uniqueId}`;

        const room = await Room.create({
            host: req.user._id,
            participants: [req.user._id],
            type: type, subject, roomName, meetLink:jitsiLink
        });

        activeRooms.set(room._id, {
            host: room.host,
            participants: room.participants,
            subject: room.subject,
            type: room.type,
            roomName: room.roomName,
            meetLink: room.meetLink
        });
        req.io.emit('room_list_update', Array.from(activeRooms.values()));
        updateSuggestedRoomsForAll(req.io);

        res.status(201).json(room);
    } catch (err) {
        console.error('Room creation failed:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

const getActiveRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      status: 'active',
      $nor: [
        { host: req.user._id },
        { participants: req.user._id }
      ]
    })
      .populate('host', 'name')
      .populate('participants', 'name');

    res.status(200).json(rooms);
  } catch (err) {
    console.error('Fetching active rooms failed: ', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id).populate('host', 'name email').populate('participants', 'name email');
        if (!room) return res.status(404).json({ msg: 'Room not found' });
        res.json(room);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

const joinRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ msg: 'Room not found' });
        const userId = req.user._id;
        const roomId = req.params.id;

        if (room.participants.some(p => p.toString() === userId.toString()))
            return res.status(200).json(room);

        room.participants.push(userId);
        await room.save();

        const populated = await Room.findById(room._id).populate('participants', 'name');
        res.json(populated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

const leaveRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ msg: 'Room not found' });

        const userId = req.user._id;
        const roomId = req.params.id;
        room.participants = room.participants.filter(p => p.toString() !== userId.toString());

        if (room.participants.length === 0) {
            room.status = 'inactive';
            await room.save();
            return res.json({ msg: 'Room closed (no participants)' });
        }

        if (room.host.toString() === userId.toString()) {
            room.host = room.participants[0];
        }

        await room.save();

        const populated = await Room.findById(room._id).populate('participants', 'name');
        res.json(populated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ msg: 'Room not found' });

        if (room.host.toString() !== req.user._id.toString())
            return res.status(403).json({ msg: 'Only host can delete room' });

        await Room.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Room deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

const getSuggestedRooms = async (req, res) => {
  try {
    // Get current user's subjects
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) return res.status(404).json({ msg: 'User not found' });

    const userSubjects = currentUser.subjects || [];

    // Find active rooms with matching subjects
    // Exclude rooms where user is host OR already a participant
    const rooms = await Room.find({
      status: 'active',
      $or: userSubjects.map(subj => ({
    subject: { $regex: `^${subj}$`, $options: 'i' }
  })),
      $nor: [
        { host: req.user._id },
        { participants: req.user._id }
      ]
    })
      .populate('host', 'name')
      .populate('participants', 'name subjects');

    res.status(200).json(rooms);
  } catch (err) {
    console.error('Fetching suggested rooms failed:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const searchRooms = async (req, res) => {
    try {
        const { subject } = req.query;
        if (!subject) {
            return res.status(400).json({ msg: 'Subject query is required' });
        }

        const rooms = await Room.find({
            status: 'active',
            subject: { $regex: subject, $options: 'i' } // case-insensitive match
        })
        .populate('host', 'name')
        .populate('participants', 'name subjects');

        res.status(200).json(rooms);
    } catch (err) {
        console.error('Room search failed:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      status: 'active',
      $or: [
        { host: req.user._id },
        { participants: req.user._id }
      ]
    })
      .populate('host', 'name email')
      .populate('participants', 'name email');

    res.status(200).json({ success: true, rooms });
  } catch (err) {
    console.error('Fetching my rooms failed: ', err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};
            
export default { createRoom, getActiveRooms, getRoomById, joinRoom, leaveRoom, deleteRoom, getSuggestedRooms, searchRooms, getMyRooms}