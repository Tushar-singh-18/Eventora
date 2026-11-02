const mongoose = require('mongoose')
async function connectdb(){
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
    console.log("DB is connected");
}

module.exports = connectdb