
const bcrypt = require('bcrypt');
const User = require('../Models/User');
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
}

module.exports = new UserService();


