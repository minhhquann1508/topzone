const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        const connection = await mongoose
            .connect(process.env.MONGO_URL);
        if (connection.connection.readyState === 1) console.log('DB connection successfull');
        else console.log('DB connection failed');
    } catch (error) {
        console.log('DB connection failed');
        throw new Error(error);
    }
};

module.exports = dbConnect;