
const bcrypt = require('bcrypt');
const User = require('../Models/User');
class UserService {
  async register(email, username, password, roles = ['manager']) {
    let user = await User.findOne({ username });
    if (user) {
      throw new Error('User already registered.');
    }
    console.log('password-', password);
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

  async login(username, password) {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('Authentication failed. User not found.');
    }
    console.log(user);
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

module.exports = new UserService();


