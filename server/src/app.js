const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const discussionRoutes = require('./routes/discussion.routes');
const cors = require('cors');
const cookie = require('cookie-parser');


connectDB();
const app = express();

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use(cookie());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api/discussion', discussionRoutes);

module.exports = app; 