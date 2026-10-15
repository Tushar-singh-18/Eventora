require('dotenv').config()
const app = require("./src/app")
const connectdb = require("./src/db/db")

const PORT = process.env.PORT || 3000
connectdb()

app.listen(PORT,()=>{
    console.log("Server has started", PORT);  
})