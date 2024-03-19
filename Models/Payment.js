const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const paymentSchema = new Schema({
    tenant: {
        type: Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
    },
    month: {
        type: Date,
        required: true,
    },
    rent: {
        type: Number,
        required: true,
    },
    electricBill: {
        type: Number,
        required: true,
    },
    gasBill: {
        type: Number,
        required: true,
    },
    waterBill: {
        type: Number,
        required: true,
    },
    otherBill: {
        type: Number,
        default: 0,
    },
    totalPayable: {
        type: Number,
        default: 0,
    },
    amountPaid: {
        type: Number,
        default: 0,
    },
    remaining: {
        type: Number,
        default: 0,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
});

module.exports = model('Payment', paymentSchema);
