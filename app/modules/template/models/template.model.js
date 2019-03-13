const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const status = ["Active", "Inactive"];
const deleted = [true, false];

const TemplateSchema = new Schema({
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  language: {
    type: Schema.Types.ObjectId,
    ref: 'Language'
  },
  slug: {
    type: String,
    default: ''
  },
  translate: [{
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    language: {
      type: Schema.Types.ObjectId,
      ref: 'Language'
    },
    _id: false
  }],
  status: {
    type: String,
    default: 'Active',
    enum: status
  },
  is_deleted: {
    type: Boolean,
    default: false,
    enum: deleted
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// For pagination
TemplateSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model('Template', TemplateSchema);