const Service = require('../models/Service');
const Content = require('../models/Content');
const Booking = require('../models/Booking');
const Feedback = require('../models/Feedback');
const DaySettings = require('../models/DaySettings'); 

// 1. ADMIN LOGIN PAGE
exports.getLogin = (req, res) => {
    // Check if the URL has ?error=true (from a failed login attempt)
    const error = req.query.error ? "Invalid Username or Password" : null;
    
    // Pass the 'error' variable to the view
    res.render('admin/login', { error });
};
// 2. ADMIN LOGIN POST
exports.postLogin = (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        req.session.admin = true;
        res.redirect('/admin');
    } else {
        res.redirect('/admin/login?error=true');
    }
};

// 3. ADMIN DASHBOARD
exports.getDashboard = async (req, res) => {
    try {
        // Auto-complete past bookings
        const now = new Date();
        await Booking.updateMany(
            { date: { $lt: now }, status: { $ne: 'Cancelled' }, status: { $ne: 'Completed' } },
            { $set: { status: 'Completed' } }
        );

        const services = await Service.find({});
        const bookings = await Booking.find({}).populate('service').sort({ date: -1 });
        const testimonials = await Feedback.find({ isApproved: false });
        const posts = await Content.find({ type: 'Blog' });

        res.render('admin/dashboard', { services, bookings, testimonials, posts });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
};

// 4. LOGOUT
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/admin/login');
    });
};

// 5. CREATE SERVICE
exports.createService = async (req, res) => {
    try {
        await Service.create(req.body);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.redirect('/admin');
    }
};

// 6. UPDATE SERVICE
exports.updateService = async (req, res) => {
    try {
        await Service.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.redirect('/admin');
    }
};

// 7. DELETE SERVICE
exports.deleteService = async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.redirect('/admin');
    }
};

// 8. UPDATE BOOKING STATUS
exports.updateBookingStatus = async (req, res) => {
    try {
        await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status });
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.redirect('/admin');
    }
};

// 9. CREATE CONTENT (BLOG)
exports.createContent = async (req, res) => {
    try {
        const { title, tags } = req.body; 
        const tagArray = tags ? tags.split(',').map(t => t.trim()) : []; 
        
        let imagePath = '';
        if (req.file) {
            imagePath = '/uploads/' + req.file.filename;
        } else {
            imagePath = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=80';
        }
        
        await Content.create({
            title,
            body: req.body.content, 
            imageURL: imagePath,    
            tags: tagArray,
            type: 'Blog'
        });

        res.redirect('/admin');
    } catch (err) {
        console.error("Blog Upload Error:", err);
        res.redirect('/admin');
    }
};

// 10. EDIT CONTENT
exports.getEditContent = async (req, res) => {
    const content = await Content.findById(req.params.id);
    res.render('admin/editContent', { content });
};

exports.updateContent = async (req, res) => {
    await Content.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/admin');
};

exports.deleteContent = async (req, res) => {
    await Content.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
};

// 11. FEEDBACK MANAGEMENT
exports.approveTestimonial = async (req, res) => {
    await Feedback.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.redirect('/admin');
};

exports.replyToFeedback = async (req, res) => {
    try {
        await Feedback.findByIdAndUpdate(req.params.id, {
            reply: req.body.reply
        });
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.redirect('/admin');
    }
};

// ==========================================
// 12. UPDATE SCHEDULE (FIXED LOGIC)
// ==========================================
exports.updateSchedule = async (req, res) => {
    try {
        // We removed 'action'. Now we look directly for 'isBlocked'.
        const { date, isBlocked, slotCapacities, disabledSlots } = req.body;

        if (!date) return res.redirect('/admin?msg=date_required');

        let settings = await DaySettings.findOne({ date });
        if (!settings) {
            settings = new DaySettings({ date });
        }

        // 1. Handle Blocking
        // Checkbox sends 'true' (string) if checked, or undefined if unchecked.
        // Boolean(undefined) is false. Boolean('true') is true.
        settings.isBlocked = !!isBlocked; 

        // 2. Update Capacities
        // Reset the map and refill it
        settings.slotCapacities = new Map();
        if (slotCapacities) {
            for (const [time, cap] of Object.entries(slotCapacities)) {
                // Only save if it's a valid number
                if (cap && cap.trim() !== "") {
                    settings.slotCapacities.set(time, parseInt(cap));
                }
            }
        }

        // 3. Update Disabled Slots
        // Handle array vs string vs undefined
        if (Array.isArray(disabledSlots)) {
            settings.disabledSlots = disabledSlots;
        } else if (typeof disabledSlots === 'string') {
            settings.disabledSlots = [disabledSlots];
        } else {
            settings.disabledSlots = [];
        }

        await settings.save();
        res.redirect('/admin?msg=schedule_updated');
    } catch (err) {
        console.error(err);
        res.redirect('/admin?msg=error');
    }
};