const { Schema, model } = require('mongoose');

const tenantSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    nidNo: {
        type: String,
        required: true,
        unique: true,
    },
    rent: {
        type: Number,
        required: true,
    },
    room: {
        type: String,
        required: true,
    },
    moveInDate: {
        type: Date,
        required: false,
    },
    moveOutDate: {
        type: Date,
        required: false,
    },
    deposit: {
        type: Number,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    powerbillUnit: {
        type: String,
        required: false,
    },
    powerbill: {
        type: String,
        required: false,
    },
    waterbill: {
        type: String,
        required: false,
    },
    gasbill: {
        type: String,
        required: false,
    },
    otherbill: {
        type: String,
        required: false,
    },
});

module.exports = model('Tenant', tenantSchema);
