require('dotenv').config()
const app = require("./src/app")
const connectdb = require("./src/db/db")

const PORT = process.env.PORT || 3000

async function startServer() {
    await connectdb()
    app.listen(PORT, () => {
        console.log("Server has started", PORT);
    })
}

startServer().catch((error) => {
    console.error("Unable to start server:", error)
    process.exit(1)
})