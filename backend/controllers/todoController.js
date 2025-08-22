import Task from '../models/Task.js'
import mongoose from 'mongoose';

const getTasks = async (req,res)=>{
    const tasks= await Task.find({user: req.user._id});
    if(!tasks) return res.status(404).json({msg:'Tasks not found'});
    res.status(200).json(tasks);
};

const addTask = async(req,res)=>{
    const {title, dueDate} = req.body;
    const task = await Task.create({
        user: req.user._id,
        title,
        dueDate,
        completed:false,
    });
    res.status(201).json(task);
};

const updateTask = async (req, res)=>{
    const task = await Task.findOne({_id:req.params.id, user: req.user._id});
    if(!task) return res.status(404).json({msg: 'Task not found'});

    const { title, dueDate, completed} = req.body;
    if(title !== undefined) task.title = title;
    if(dueDate !==undefined) task.dueDate = dueDate;
    if(completed!== undefined) task.completed = completed;

    const updated = await task.save();
    res.json(updated);
};

const deleteTask = async (req, res)=>{
    const task = await Task.findOneAndDelete({_id: req.params.id , user:req.user._id});
    if(!task) return res.status(404).json({msg: 'Task not found'});
    res.json({msg: 'Task deleted successfully'});
};

export const toggleComplete = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate task ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid task id" });
    }

    // Check user
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized: User missing" });
    }

    // Find task owned by user
    const task = await Task.findOne({ _id: id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // Toggle completion
    task.completed = !task.completed;
    const updatedTask = await task.save();

    return res.json(updatedTask);
  } catch (err) {
    console.error("Error in toggleComplete:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export default {getTasks, addTask, updateTask, deleteTask, toggleComplete};