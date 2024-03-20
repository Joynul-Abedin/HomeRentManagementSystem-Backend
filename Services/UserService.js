const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../Models/User');
const { sendResetEmail } = require('./EmailService');

class UserService {
  async register(email, username, password, roles = ['manager']) {
    let user = await User.findOne({ username });
    if (user) {
      throw new Error('User already registered.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      email,
      username,
      password: hashedPassword,
      roles
    });

    await user.save();
    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async login(email, username, password) {
    if (email) {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('Authentication failed. User not found.');
      }
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error('Authentication failed. Wrong password.');
        }
        const { password: _, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
      }
    }
    if (username) {
      const user = await User.findOne({ username });

      if (!user) {
        throw new Error('Authentication failed. User not found.');
      }
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error('Authentication failed. Wrong password.');
        }
        const { password: _, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
      }
    }
  }

  async requestPasswordReset(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User does not exist.');
    }

    // Generate a token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    await user.save();

    const resetUrl = `https://hrms-f96y.onrender.com/api/users/reset-password/${resetToken}`;
    await sendResetEmail(email, resetUrl); // Implement this function according to your email service

    return { message: "If a user with that email is registered, they'll receive a password reset email.", token: resetToken};
  }

  // In UserService
  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Password reset token is invalid or has expired.');
    }

    // Set the new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    return { message: 'Password has been updated.' };
  }

}

module.exports = new UserService();


