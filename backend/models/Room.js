import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    type: {type:String, enum:['solo','group'], required:true},
    subject: {type:String},
    roomName: {type:String, required:true},
    status: {type:String, enum:['active','inactive'], default: 'active'},
    meetLink:{type:String},
},{timestamps:true});

export default mongoose.model('Room', roomSchema);