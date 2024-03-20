const express= require('express');
const router = express.Router();
const UserService = require('../Services/UserService');

// User registration route
router.post('/register', async (req, res) => {
  try {
    const roles = req.body.roles || ['manager'];
    const user = await UserService.register(req.body.email ,req.body.username, req.body.password, roles);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// User login route
router.post('/login', async (req, res) => {
  try {
    const user = await UserService.login(req.body.email, req.body.username, req.body.password);
    res.send({ message: 'Login successful', user: { email: user.email, username: user.username, roles: user.roles } });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

// Request password reset route
router.post('/password-reset', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await UserService.requestPasswordReset(email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// In your routes file
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const result = await UserService.resetPassword(token, newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;