import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const generateToken= (userId)=>{
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn:'7d'});
};

const signup = async (req ,res)=>{
    const {name, email, password} =req.body;
    try{
        const exists = await User.findOne({email});
        if(exists) return res.status(400).json({msg: 'User already exists'});

        const user = await User.create({name,email,password});
        res.status(201).json({
            token: generateToken(user._id),
            user: {id: user._id, name: user.name, email:user.email},
        })
    }
    catch(err){
        res.status(500).json({mssg:'Server error'});
    }
};

const login = async (req,res) =>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user || !(await user.matchPassword(password))){
            return res.status(400).json({msg: 'Invalid credentials'});
        }

        res.json({
            token: generateToken(user._id),
            user: {id: user._id, name: user.name, email:user.email},
        });
    } catch(err){
        res.status(500).json({msg: 'Server error'});
    }
};

export default {signup, login};