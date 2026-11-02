const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const userModel = require('./src/model/user');
const eventModel = require('./src/model/Event');
const bookingModel = require('./src/model/Booking');

dotenv.config();

const demoAdminEmail = process.env.DEMO_ADMIN_EMAIL || 'demo-admin@eventora.com';
const demoEvents = [
    {
        title: 'Demo: Product & Engineering Summit',
        description: 'A sample conference exploring product strategy, software architecture, and practical AI.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        location: 'Innovation Hall, San Francisco',
        category: 'Technology',
        totalSeats: 120,
        ticketPrice: 75,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Demo: Local Sounds Music Night',
        description: 'An evening showcase featuring independent artists and local bands.',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        location: 'Riverside Stage, Austin',
        category: 'Music',
        totalSeats: 250,
        ticketPrice: 35,
        image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Demo: Creative Arts Open House',
        description: 'A sample gallery event with installations, workshops, and artist talks.',
        date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        location: 'Central Arts Gallery, Chicago',
        category: 'Art',
        totalSeats: 90,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=80&w=800'
    }
];

async function findOrCreateUser({ name, email, role }) {
    let user = await userModel.findOne({ email });
    if (user) {
        if (user.role !== role) {
            throw new Error(`The demo seed email ${email} is already assigned to a different role.`);
        }
        return user;
    }

    user = await userModel.create({
        name,
        email,
        role,
        isVerified: true,
        password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10)
    });
    return user;
}

async function ensureBooking(user, event, status, paymentStatus) {
    const existing = await bookingModel.findOne({ userId: user._id, eventId: event._id });
    if (existing) {
        if (!existing.isDemo) {
            throw new Error(`Refusing to reuse a non-demo booking for "${event.title}".`);
        }
        return;
    }

    await bookingModel.create({
        userId: user._id,
        eventId: event._id,
        status,
        paymentStatus,
        amount: event.ticketPrice,
        isDemo: true
    });

    if (status === 'confirmed') {
        const result = await eventModel.updateOne(
            { _id: event._id, availableSeats: { $gt: 0 } },
            { $inc: { availableSeats: -1 } }
        );
        if (result.modifiedCount !== 1) {
            throw new Error(`Unable to reserve a sample seat for "${event.title}".`);
        }
    }
}

async function seedDemo() {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be set before seeding demo data.');
    }

    await mongoose.connect(process.env.MONGO_URI);
    const demoAdmin = await findOrCreateUser({
        name: 'Eventora Demo Admin',
        email: demoAdminEmail,
        role: 'demo_admin'
    });
    const attendees = await Promise.all([
        findOrCreateUser({ name: 'Jordan Lee', email: 'jordan.lee@demo.eventora.invalid', role: 'user' }),
        findOrCreateUser({ name: 'Taylor Morgan', email: 'taylor.morgan@demo.eventora.invalid', role: 'user' })
    ]);

    const events = [];
    for (const eventData of demoEvents) {
        let event = await eventModel.findOne({ title: eventData.title });
        if (event && !event.isDemo) {
            throw new Error(`Refusing to reuse non-demo event "${eventData.title}".`);
        }
        if (!event) {
            event = await eventModel.create({
                ...eventData,
                availableSeats: eventData.totalSeats,
                isDemo: true,
                createdBy: demoAdmin._id
            });
        }
        events.push(event);
    }

    await ensureBooking(attendees[0], events[0], 'confirmed', 'paid');
    await ensureBooking(attendees[1], events[1], 'pending', 'not_paid');
    await ensureBooking(attendees[0], events[2], 'confirmed', 'paid');

    console.log(`Demo admin ready: ${demoAdminEmail}`);
    console.log(`Ensured ${events.length} sample events and 3 sample bookings.`);
}

seedDemo()
    .catch((error) => {
        console.error('Unable to seed demo account:', error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
