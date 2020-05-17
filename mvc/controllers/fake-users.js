const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

let dogNames = [
  "Alger",
  "Muñeca",
  "Molly",
  "Bart",
  "Baxter",
  "Kassio",
  "Bruto",
  "Munich",
  "Otto",
  "Punky",
  "Rémi",
  "Dereck",
  "Curro",
  "Lucas",
  "Boss",
  "Thor",
  "Vincenzo",
  "Tyssen",
  "Frodo",
  "York",
  "Bobby",
  "Yanet",
  "Orejas",
  "Muñeca",
  "Molly",
  "Nené",
  "Queen",
  "Rumba",
  "Sasha",
  "Electra",
  "Dana",
  "Pink",
  "Ginger",
  "Tormenta",
  "Hydra",
  "Shelly",
  "Sassy",
  "Kira",
  "Lola",
  "Vilma",
  "Lisca",
  "Patton",
  "Ratón",
  "Chiqui",
  "Baby",
  "Cuqui",
  "Oreo",
  "Roco",
  "Brownie",
  "Moon",
  "Wolf",
  "Fluffy",
  "Joy"
];

const registerFakeUser = function(elem, index) {
  // This function will return a promise.  The promise gets resolved when the user is saved successfully.
  return new Promise(function(resolve, reject) {

    // Create the user user
    let user = new User();
    user.name = elem;
    user.email = `user${index + 1}@user.com`;
    user.profile_img = `${index + 1}`;
    // All users have the same password, "f".  It will allow us to log into any account we want.
    user.setPassword("abc123.password");

    user.save((err, user) => {
      if(err) { reject(); console.log(err) }
      resolve(user);
    });
  });
}

const createFakeUsers = function(req, res) {
  // It will be calling the registerFakeUser function above.
  function createFakeUser() {
    function createUsers() {
      // console.log("ENTREI AQUI");
      for(let i = 0; i < dogNames.length; i++) {
        let promise = new Promise(function(resolve, reject) {
          registerFakeUser(dogNames[i], i).then((val) => {
            resolve(val);
          });
        });
        promises.push(promise);
      }
    }

    let promises = [];
    createUsers();

    //console.log(promises);

    return new Promise(function(resolve, reject) {
      Promise.all(promises).then((val) => {
        resolve(val);
      });

    });

  }

  createFakeUser();
}

module.exports = {
  createFakeUsers,
}
