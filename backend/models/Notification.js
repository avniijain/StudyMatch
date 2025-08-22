import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['room_request'], required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    message: { type: String },
    isRead: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema);
