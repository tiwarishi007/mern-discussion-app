const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email']
    },
    password:{
        type:String,
        required:true,
        minlength : 6,
    }
},
{
    timestamps:true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;