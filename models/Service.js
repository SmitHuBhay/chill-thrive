const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    // ALLOW ANY CATEGORY NAME
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    discountPercent: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Service', serviceSchema);