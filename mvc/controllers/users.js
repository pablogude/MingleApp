const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Message = mongoose.model("Message");

const registerUser = function({body},res) {

  if(
    !body.name ||
    !body.email ||
    !body.password ||
    !body.password_confirm
  ) {
    return res.send({message: "All Fields are required."})
  }

  if(body.password !== body.password_confirm) {
    return res.send({message: "Two different passwords provided."})
  }

  const user = new User();

  user.name = body.name.trim();
  user.email = body.email;
  user.setPassword(body.password);
  user.profile_img = "avatar";

  user.save((err, newUser) => {
    if(err) {
      if(err.errmsg && err.errmsg.includes("duplicate key error")) {
        return res.json({message: "The provided email is already registered."})
      }
      return res.json({ message: "Something went wrong. Try it again."})
    } else {
      const token = user.getJwt();
      res.status(201).json({message:"User registered"});
    }
  });
}

const loginUser = function(req,res) {
  if(!req.body.email || !req.body.password) {
    return res.status(400).json({message: "All fields are required."})
  }

  passport.authenticate("local", (err,user,info) => {
    if(err) { return res.status(404).json(err) }
    if(user) {
      const token = user.getJwt();
      res.status(201).json({token});
    } else { res.json(info); }
  })(req,res);

}

const generateFeed = function(req, res) {
  User.find({}, function(err, users) {
    var userMap = [];

    users.forEach(function(user) {
      userMap.push(user);
    });

    res.status(200).send(userMap);
  });

}

const getUserData = function({params}, res) {

  User.findById(params.userid, "-salt -password", {lean: true}, (err, user) => {
    if(err) { return res.statusJson(400, { err: err }); }
    if(!user) { return res.json(404, { message: "User does not exist." }); }

    res.status(200).json({ user: user });
  });
}

const deleteUser = function(req, res) {

  User.findOne({ _id: req.params.userid }, function (err, user) {
    if(err) { return res.send({ error: err }); }
    user.remove();
    return res.json({ message: "Deleted user."});
  });
}

const updateUser = function(req,res) {

  User.findByIdAndUpdate({ _id: req.params.userid },{ name: req.body.name }, function(err, user){
    if(err) { return res.send({ error: err }); }
    user.save();
    return res.json({ message: "Updated user."});
  });

}

const sendMessage = function({ body, params },res) {

  let from = body.from;
  let to = params.to;

  let fromPromise = new Promise(function(resolve,reject) {
    User.findById(from, "messages", (err, user) => {
      if(err) { reject("Error", err); return res.json({ err:err });}

      from = user;
      resolve(user);
    })
  });
  let toPromise = new Promise(function(resolve,reject) {
    User.findById(to, "messages notifications", (err, user) => {
      if(err) { reject("Error", err); return res.json({ err:err });}

      to = user;
      resolve(user);
    })
  });

  let sendMessagePromise = Promise.all([fromPromise,toPromise]).then(() => {

    function hasMessagesFrom(messages, id) {

      for(let message of messages) {
        if(message.from_id == id) {
          return message;
        }
      }

    }

    function sendMessageTo(to, from, notify = false) {
      return new Promise(function(resolve, reject) {

        if(notify) {
          let numberOfNotifications = to.notifications;
          numberOfNotifications++;
          to.notifications = numberOfNotifications;
        }

        if(foundMessage = hasMessagesFrom(to.messages, from._id)) {
          foundMessage.content.push(message);
          to.save((err, user) => {
            if(err) { reject("Error", err); return res.json({ err:err });}
            resolve(user);
          });
        } else {

          let newMessage = new Message();
          newMessage.from_id = from._id;
          newMessage.content = [message];

          to.messages.push(newMessage);
          to.save((err, user) => {
            if(err) { reject("Error", err); return res.json({ err:err });}
            resolve(user);
          });
        }
      });

    }

    let message = {
      messenger: from._id,
      message: body.content
    }

    let sendMessageToRecipient = sendMessageTo(to,from, true);
    let sendMessageToAuthor = sendMessageTo(from,to);

    return new Promise(function(resolve, reject) {
      Promise.all([sendMessageToRecipient, sendMessageToAuthor]).then(() => {
        resolve();
      });
    });
  });

  sendMessagePromise.then(() => {
    return res.status(201).json({ message: "Sending message" });
  });
}

const resetNotifications = function(req, res) {
  User.findByIdAndUpdate({ _id: req.params.userid },{ notifications: "0" }, function(err, user){
    if(err) { return res.send({ error: err }); }
    user.save();
    return res.json({ message: "Updated notifications."});
  });
}

const getMessages = function({params}, res) {

  User.findById(params.userid, "-salt -password", {lean: true}, (err, user) => {
    if(err) { return res.statusJson(400, { err: err }); }

    function addMessengerDetails(messages) {
      return new Promise(function(resolve, reject) {
        if(!messages.length) { resolve(messages); }

        let usersArray = [];

        for(let message of messages) {
          usersArray.push(message.from_id);
        }

        User.find({'_id': { $in: usersArray }}, "name profile_img", (err, users) => {
          if(err) { return res.json({ err: err }); }

          for(message of messages) {
            for(let i = 0; i < users.length; i++) {
              if(message.from_id == users[i]._id) {
                message.messengerName = users[i].name;
                message.messengerProfileImage = users[i].profile_img;
                users.splice(i, 1);
                break;
              }
            }
          }

          resolve(messages);
        });
      });
    }

    let messageDetails = addMessengerDetails(user.messages);

    Promise.all([messageDetails]).then((val) => {
      user.messages = val[0];
      res.status(200).json({ user: user });
    });
  });

}

const deleteMessage = function({params}, res) {

  User.findById(params.userid, "messages", {lean: true}, (err, user) => {
    if(err) { return res.statusJson(400, { err: err }); }
    User.findOne({'messages._id': params.messageid}, function (err, result) {
      if(err) { return res.statusJson(400, { err: err }); }
      result.messages.id(params.messageid).remove();
      result.save();
      res.status(201).json({message:"Message succesfully removed."});
    });
  });
}

// Used only in development

const deleteAllUsers = function(req, res) {
  User.deleteMany({}, (err, info) => {
    if(err) { return res.send({ error: err }); }
    return res.json({ message: "Deleted All Users", info: info });
  });
}

module.exports= {
  registerUser,
  loginUser,
  generateFeed,
  getUserData,
  deleteAllUsers,
  deleteUser,
  updateUser,
  sendMessage,
  resetNotifications,
  getMessages,
  deleteMessage
}
