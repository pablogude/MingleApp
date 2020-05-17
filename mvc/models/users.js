const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


const messageSchema = new mongoose.Schema({
  from_id: {
    type: String,
    required: true,
  },
  content: [{
    messenger: String,
    message: String
  }]
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: String,
  salt: String,
  messages: [messageSchema],
  profile_img: String,
  notifications: {
    type: Number,
    default: 0
  },
});

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(64).toString('hex');
  this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString('hex');
}

userSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString('hex');
  return hash === this.password;
}

userSchema.methods.getJwt = function() {
  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    profile_img: this.profile_img,
  }, process.env.JWT_TOKEN);

}

mongoose.model("User", userSchema);
mongoose.model("Message", messageSchema);
