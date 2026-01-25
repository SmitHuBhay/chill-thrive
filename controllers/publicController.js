const Service = require('../models/Service');
const Booking = require('../models/Booking');
const DaySettings = require('../models/DaySettings');
const Feedback = require('../models/Feedback');
const Content = require('../models/Content');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: { rejectUnauthorized: false }
});
exports.getContact = (req, res) => {
    res.render('contact');
}
const DEFAULT_CAPACITY = 5;
const ALL_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"];

// 1. Home
exports.getHome = async (req, res) => {
    try {
        const services = await Service.find({}).limit(3);
        const reviews = await Feedback.find({ isApproved: true }).sort({ createdAt: -1 }).limit(3);
        res.render('index', { services, reviews });
    } catch (e) { res.render('index', { services: [], reviews: [] }); }
};

// 2. Services
exports.getServices = async (req, res) => {
    const services = await Service.find({});
    res.render('services', { services });
};

// 3. Booking Page (View)
exports.getBooking = async (req, res) => {
    if (!req.session.user && !req.user) return res.redirect('/user/login');
    const services = await Service.find({});
    res.render('booking', { 
        services, 
        selectedService: req.query.service, 
        user: req.session.user || req.user 
    });
};

// 4. API: Check Availability (CRITICAL FUNCTION)
exports.checkAvailability = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.json({ error: 'Date required' });

        // Check Day Settings (Blocked/Holiday)
        const settings = await DaySettings.findOne({ date });
        if (settings && settings.isBlocked) {
            return res.json({ blocked: true, slots: [] });
        }

        // Check Existing Bookings
        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const bookings = await Booking.find({
            date: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'Cancelled' }
        });

        // Calculate Remaining Slots
        const counts = {};
        bookings.forEach(b => counts[b.timeSlot] = (counts[b.timeSlot] || 0) + 1);

        const availableSlots = [];
        ALL_SLOTS.forEach(slot => {
            // Check if specifically disabled
            if (settings && settings.disabledSlots && settings.disabledSlots.includes(slot)) return;
            
            // Determine capacity
            let capacity = DEFAULT_CAPACITY;
            if (settings && settings.slotCapacities && settings.slotCapacities.get(slot)) {
                capacity = settings.slotCapacities.get(slot);
            }

            // Add if space exists
            if ((capacity - (counts[slot] || 0)) > 0) {
                availableSlots.push({ 
                    time: slot, 
                    remaining: capacity - (counts[slot] || 0) 
                });
            }
        });

        res.json({ blocked: false, slots: availableSlots });
    } catch (err) {
        console.error("❌ Schedule Error:", err);
        res.status(500).json({ error: 'Server Error' });
    }
};

// 5. Submit Booking
exports.postBooking = async (req, res) => {
    try {
        const currentUser = req.session.user || req.user;
        if (!currentUser) return res.redirect('/user/login');

        await Booking.create({
            user: currentUser._id,
            customerName: currentUser.name,
            email: currentUser.email,
            phone: req.body.phone,
            service: req.body.service,
            date: req.body.date,
            timeSlot: req.body.timeSlot,
            paymentMethod: req.body.paymentMethod || 'Cash'
        });

        // Send Email (Async, don't wait)
        const mailOptions = {
            from: `"Chill & Thrive" <${process.env.EMAIL_USER}>`,
            to: currentUser.email,
            subject: 'Booking Confirmation',
            html: `<p>Hi ${currentUser.name}, your booking on ${req.body.date} at ${req.body.timeSlot} is confirmed.</p>`
        };
        transporter.sendMail(mailOptions).catch(err => console.log("Email failed", err));

        res.redirect('/?msg=booking_success');
    } catch (err) {
        console.error(err);
        res.redirect('/?msg=error');
    }
};

// 6. Other Pages
exports.getFounder = (req, res) => res.render('founder');
exports.getFeedback = (req, res) => res.render('feedback');
exports.postFeedback = async (req, res) => {
    await Feedback.create(req.body);
    res.redirect('/?msg=success');
};
exports.getAwareness = async (req, res) => {
    const posts = await Content.find({ type: 'Blog' });
    res.render('awareness', { posts });
};