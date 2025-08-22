import User from '../models/User.js'

const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.status(200).json(user);
};

const updateProfile = async (req,res) =>{
    try{
        const user = await User.findById(req.user._id);
    if(!user) return res.status(404).json({msg:'User not found'});

    const {name, subjects, gender, goals} = req.body;
    if(name) user.name = name;
    if(Array.isArray(subjects)) user.subjects = subjects;
    if(gender && ['Male', 'Female', 'Other'].includes(gender)) user.gender = gender;
    if(Array.isArray(goals)) user.goals = goals;

    const updateUser = await user.save();
    res.status(200).json({
        id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      gender: updateUser.gender,
      subjects: updateUser.subjects,
      goals: updateUser.goals,
    });
    } catch(err){
        console.error('Profile update error:',err);
        res.status(500).json({msg :'Server error'});
    }
};

export default {
  getMe,
  updateProfile,
};
