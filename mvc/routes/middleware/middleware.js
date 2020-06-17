const jwt = require('express-jwt');

// this is gonna check if a Json Web Token is sent whith the request

const authorize = jwt({
  secret: process.env.JWT_TOKEN,
  userProperty: 'payload'
});

module.exports = {
  authorize
}
