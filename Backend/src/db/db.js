const mongoose = require('mongoose')
async function connectdb(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB is connected");
        
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = connectdb