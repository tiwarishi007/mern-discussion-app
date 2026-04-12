const mongoose = require('mongoose');
const { db } = require('./env');

const connectDB = async ()=>{
    try {
        await mongoose.connect(db);
        console.log(`MongoDB Database Connected`);
    } catch (error) {
        console.log(`Error occured while DB setup : ${error}`);
        process.exit(1);
    }
}

module.exports = connectDB;