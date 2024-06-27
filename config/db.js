const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        .then((res)=>{
            console.log(`Successfully connected to DB`);
        })
        .catch((err)=>{
            console.log('Error connecting to DB=>', err);
        })
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
