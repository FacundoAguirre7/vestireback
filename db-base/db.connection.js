const mongoose= require('mongoose');

const dbConnection= async()=>{
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('estamos conectados a la db');
    } catch (error) {
        console.log(error.message);
    }
};
dbConnection();