var {User} = require('./../models/users');

var authenticate = (req , res, next) => {
  var token = req.header('x-auth');
  User.findBytoken(token).then((user) => {
    if(!user) {
      return Promise.reject();
    }
    req.user = user;
    req.token = token;
    next();
  }).catch((err) => {
    res.status(401).send();
  });
}

module.exports = {authenticate};
