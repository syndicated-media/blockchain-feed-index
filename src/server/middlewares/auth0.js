const jwt = require('jsonwebtoken');
const secret = 'vuRUTsLNBBx_De3_5GOi7KJp4nrSjtFFwHGxcXf5Nby4v_NoKbNX1Vr3aZvDsxTU';

module.exports = (req, res, next) => {
  try {
    let auth = req.headers.authorization.split('Bearer ')[1];
    let decoded = jwt.verify(auth, secret);
    req.user = decoded.sub.split('auth0|')[0];
    next();
  } catch (e) {
    res.status(401).send();
  }
}
