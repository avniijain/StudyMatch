import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
    title: {type: String, required:[true,'Task title is required']},
    completed: {type: Boolean, default:false},
    dueDate:{type:Date}
}, {timestamps:true});

export default mongoose.model('Task', taskSchema)