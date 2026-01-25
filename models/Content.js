const mongoose = require('mongoose');
const contentSchema = new mongoose.Schema({
    title: String,
    body: String,
    tags: [String],
    imageURL: String,
    type: { type: String, default: 'Blog' },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Content', contentSchema);