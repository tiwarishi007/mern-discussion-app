const generateToken = require('../utils/generateToken');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

exports.register = async (req, res)=>{
    const { fullName, email, password} = req.body;
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All Fields are required"});
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({message:"User already Exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashP = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password:hashP
        })

        generateToken(newUser._id, res);
        res.status(201).json({
            id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email
        });

    } catch (error) {
        console.log(`Error occured in register controller : ${error}`);
        return res.status(500).json({message:"Server Error"});
    }
}

exports.login = async (req, res)=>{
    const { email, password } = req.body;
    try {
        if(!email || !password){
            return res.status(400).json({message:"All Fields are required"});
        }

        const user = await  User.findOne({email});

        if(!user){
            return res.status(400).json({message:"User Not Found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"});
        }

        generateToken(user._id, res);

        res.status(200).json({
            id:user._id,
            fullName:user.fullName,
            email:user.email
        });

    } catch (error) {
        console.log(`Error occured in Login controller : ${error}`);
        return res.status(500).json({message:"Server Error"});
    }
}
exports.logoutUser = async (req, res)=>{
    try{
        res.cookie("token", "", {maxAge:0});
        res.status(200).json({message:"logged out Successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Server error"});
    }
}