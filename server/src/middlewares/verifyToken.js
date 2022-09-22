const jwt = require('jsonwebtoken');

function verify(req, res, next) {
  const token = req.header('auth-token');
  if (token) {
    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = verified;
      next();
    } catch (error) {
      res.status(400).send('Invalid Token');
    }
  }
  return res.status(401).send('Access Denied');
}

module.exports = verify;
