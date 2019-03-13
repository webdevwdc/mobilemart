const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const status = ["Active", "Inactive"];

const CmsSchema = new Schema({
  title: { type: String, default: '' },
  slug: { type: String, default: '' },
  desc: { type: String, default: '' },
  content: { type: String, default: '' },
  translate: [{
    title: { type: String, default: '' },
    desc: { type: String, default: '' },
    content: { type: String, default: '' },
    language: { type: Schema.Types.ObjectId, ref: 'Language' },
    _id: false
  }],
  status: { type: String, default: "Active", enum: status },
  language: { type: Schema.Types.ObjectId, ref: 'Language' },
});

// For pagination
CmsSchema.plugin(mongooseAggregatePaginate);

// create the model for users and expose it to our app
module.exports = mongoose.model('Cms', CmsSchema);