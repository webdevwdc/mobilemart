const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enumValue = [true, false];
const status = ["Active", "Inactive"];
const deleted = [true, false];
const languageCode = ['EN', 'FR']

const LanguageSchema = new Schema({
  title: { type: String, default: '' },
  code: { type: String, default: 'EN', enum: languageCode },
  isDefault: { type: Boolean, default: false, enum: enumValue },
  isDeleted: { type: Boolean, default: false, enum: deleted },
  status: { type: String, default: 'Active', enum: status }
});


// create the model for membership and expose it to our app
module.exports = mongoose.model('Language', LanguageSchema);