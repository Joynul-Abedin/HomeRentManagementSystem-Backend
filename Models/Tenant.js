const { Schema, model } = require('mongoose');
const Payment = require('./Payment');

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
    qrCode: { // Add this field for storing QR code data
        type: String,
        required: false,
    },
});

// Attach post-delete hook directly to the schema in the tenant model file
tenantSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
      await Payment.deleteMany({ tenant: doc._id });
    }
  });

module.exports = model('Tenant', tenantSchema);
