const mongoose = require('mongoose');

const daySettingsSchema = new mongoose.Schema({
    date: {
        type: String, // Format "YYYY-MM-DD"
        required: true,
        unique: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    slotCapacities: {
        type: Map,
        of: Number,
        default: {}
    },
    disabledSlots: [{
        type: String
    }]
});

module.exports = mongoose.model('DaySettings', daySettingsSchema);