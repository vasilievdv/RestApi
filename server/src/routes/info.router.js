const router = require('express').Router();
const verify = require('../middlewares/verifyToken');

router.get('/', verify, async (req, res) => {
  const { id } = req.user;
  res.json(id);
});

module.exports = router;
