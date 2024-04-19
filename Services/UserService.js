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
      phoneNumber: "",
      imageUrl: "",
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

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    await user.save();
    await sendResetEmail(email, resetToken);

    return { message: "If a user with that email is registered, they'll receive a password reset email."};
  }

  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Password reset token is invalid or has expired.');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    return { message: 'Password has been updated.' };
  }

  async updateUser(id, updates) {
    const { email, username, ...otherUpdates } = updates;

    // Optional: Check for email and username uniqueness if they are updated
    if (email) {
      const existingEmail = await User.findOne({ _id: { $ne: id }, email });
      if (existingEmail) {
        throw new Error('Email already in use by another account.');
      }
    }
    if (username) {
      const existingUsername = await User.findOne({ _id: { $ne: id }, username });
      if (existingUsername) {
        throw new Error('Username already in use by another account.');
      }
    }

    const user = await User.findByIdAndUpdate(id, { email, username, ...otherUpdates }, { new: true });
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }

  // Get user by id
  async getUserById(id) {
    const
      user = await User.findById(id);
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }
}

module.exports = new UserService();
