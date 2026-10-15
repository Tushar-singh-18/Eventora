const express = require('express')
const cors = require('cors')
const authRouter = require('./routes/auth.routes.js')
const bookingRouter = require('./routes/booking.routes.js')
const eventRouter = require('./routes/event.routes.js')

const app = express()
app.use(cors())  
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/events', eventRouter);
app.use('/api/bookings', bookingRouter);


module.exports = app