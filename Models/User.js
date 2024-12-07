const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    default: null
  },
  imageUrl: {
    type: String,
    default: null
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  roles: [{
    type: String,
    enum: ['manager', 'owner'],
    default: 'manager'
  }]
});

module.exports = model('User', userSchema);
