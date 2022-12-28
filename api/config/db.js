// external import
const mongoose = require('mongoose');

// establish database connection
const connectDB = async () => {
    mongoose.set('strictQuery', true);
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to the database successfully!');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;