const mongoose = require('mongoose');

const homeSettingsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true, // Ensure uniqueness across the collection
    },
    electricityCostPerUnit: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    }
    // Add other settings as needed
});

// Ensure indexes are created, especially for the unique fields
homeSettingsSchema.index({ ownerId: 1 }, { unique: true });

const HomeSettings = mongoose.model('HomeSettings', homeSettingsSchema);

module.exports = HomeSettings;
