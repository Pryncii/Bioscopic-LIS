const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect ('mongodb+srv://princebuencamino:LIS092901@lis.1ioj1.mongodb.net/labDB?retryWrites=true&w=majority&appName=LIS');
        console.log('MongoDB connected:')
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
//travis
module.exports = connectDB