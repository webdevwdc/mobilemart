var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const deleted = [true, false];
const active = [true, false];
const profileVerified = [true, false];
const emailVerified = [true, false];
const licenseVerified = [true, false];
const mobileVerified = [true, false];

const regType = ['normal', 'facebook', 'google'];
const status = ["Active", "Inactive"];
var gender = ['male', 'female', 'transgender'];

var UserSchema = new Schema({
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role'
  },
  profile_image: {
    type: String,
    default: ''
  },
  contactNumber: {
    type: String,
    default: ''
  },
  deviceToken: {
    type: String,
    default: ''
  },
  deviceType: {
    type: String,
    default: ''
  },
  isDeleted: {
    type: Boolean,
    default: false,
    enum: deleted
  },
  status: {
    type: String,
    default: "Active",
    enum: status
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

// generating a hash
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password, checkPassword) {
  return bcrypt.compareSync(password, checkPassword);
  //bcrypt.compare(jsonData.password, result[0].pass
};


// For pagination
UserSchema.plugin(mongooseAggregatePaginate);

// create the model for users and expose it to our app
module.exports = mongoose.model('User', UserSchema);