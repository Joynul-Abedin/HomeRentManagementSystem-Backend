const express= require('express');
const router = express.Router();
const UserService = require('../Services/UserService');

// User registration route
router.post('/register', async (req, res) => {
  try {
    const roles = req.body.roles || ['manager'];
    const user = await UserService.register(req.body.email ,req.body.username, req.body.password, roles);
    console.log(user);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// User login route
router.post('/login', async (req, res) => {
  try {
    const user = await UserService.login(req.body.username, req.body.password);
    res.send({ message: 'Login successful', user: { username: user.username } });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

module.exports = router;