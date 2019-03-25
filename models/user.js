const mongoose = require('mongoose');
const Schema = mongoose.Schema

const User = new Schema({
  username: String,
  password: String,
  admin: { type: Boolean, default: false }
})

//Create new user $(document).ready(function() {

  User.statics.create = function (username, password) {
    const user = new this({
      username,
      password
    })

    //return promise
    return user.save()
  }

  //find one user by using username

  User.statics.findOneByUsername = function(username) {
    return this.findOne({
      username
    }).exec()
  }

  //Verify the password of the User document
  User.methods.verify = function (password) {
    return this.password === password
  }

  User.methods.assignAdmin = function() {
    this.admin = true
    return this.save()
  }

module.exports = mongoose.model('User', User)
