const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port:process.env.PORT,
    db:process.env.MONGO_URI,
    key:process.env.SECRET_KEY,
};
