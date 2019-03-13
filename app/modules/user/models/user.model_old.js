const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const deleted = [true, false];
const active = [true, false];

const UserSchema = new Schema({
  first_name: { type: String, default: '' },
  last_name: { type: String, default: '' },
  email: { type: String, default: '' },
  phone : { type: String, default: '' },  
  password: { type: String, default: '' },
  isActive: { type: Boolean, default: true, enum: active },
  createdAt: { type: Date, default: Date.now },
  role: { type: Schema.Types.ObjectId, ref: 'Role' },
  isDeleted: { type: Boolean, default: false, enum: deleted },
  isActive: { type: Boolean, default: true, enum: active },
  createdAt: { type: Date, default: Date.now }
});

// generating a hash
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password,checkPassword) {
  return bcrypt.compareSync(password, checkPassword);
};

// For pagination
UserSchema.plugin(mongooseAggregatePaginate);

// create the model for users and expose it to our app
module.exports = mongoose.model('User', UserSchema);