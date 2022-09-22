const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { User } = require('../../db/models');

router.post('/signup', async (req, res) => {
  const { userId, password } = req.body;
  if (userId && password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
      await User.create({
        userId,
        password: hashedPassword,
      });
      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
  return res.sendStatus(400);
});

module.exports = router;
