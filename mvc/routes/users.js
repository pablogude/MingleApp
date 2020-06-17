const express = require('express');
const router = express.Router();
const middleware = require('./middleware/middleware');
const usersCtrl = require('../controllers/users');

router.post("/register",usersCtrl.registerUser);
router.post("/login", usersCtrl.loginUser);
router.get("/generate-feed",middleware.authorize, usersCtrl.generateFeed);
router.get("/:userid",middleware.authorize, usersCtrl.getUserData);
router.get("/get-user-data/:userid", usersCtrl.getUserData);
router.post("/delete-user/:userid", usersCtrl.deleteUser);
router.post("/update-user/:userid", usersCtrl.updateUser);
router.post("/send-message/:to", usersCtrl.sendMessage);
router.post("/reset-notifications/:userid", usersCtrl.resetNotifications);
router.get("/messages/:userid", middleware.authorize, usersCtrl.getMessages);
router.post("/delete-message/:userid/:messageid", usersCtrl.deleteMessage);

// Used only on development
router.delete("/all", usersCtrl.deleteAllUsers);

module.exports = router;
