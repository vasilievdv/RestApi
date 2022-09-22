const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

const refreshTokens = [];

router.post('/signin', async (req, res) => {
  const { userId } = req.body;

  if (req.body.password && userId) {
    try {
      const { password, id } = await User.findOne({ where: { userId } });
      const validPass = await bcrypt.compare(req.body.password, password);

      if (validPass) {
        const token = jwt.sign(
          { id },
          process.env.TOKEN_SECRET,
          { expiresIn: '10m' },
        );

        const refreshToken = await jwt.sign(
          { id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: '10h' },
        );

        refreshTokens.push(refreshToken);

        res.json({
          token,
          refreshToken,
        });
      }
      return res.sendStatus(401);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
  return res.sendStatus(400);
});

module.exports = router;
