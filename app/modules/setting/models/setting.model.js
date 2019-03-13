const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const status = ["Active", "Inactive"];

const SettingSchema = new Schema({
  setting_name: { type: String, default: '' },
  slug: { type: String, default: '' },
  setting_value: { type: Object },
  translate: [{
    setting_name: { type: String, default: '' },
    setting_value: { type: String, default: '' },
    language: { type: Schema.Types.ObjectId, ref: 'Language', default: null },
    _id: false
  }],
  status: { type: String, default: "Active", enum: status },
  language: { type: Schema.Types.ObjectId, ref: 'Language', default: null },
});

// For pagination
SettingSchema.plugin(mongooseAggregatePaginate);

// create the model for users and expose it to our app
module.exports = mongoose.model('Setting', SettingSchema);