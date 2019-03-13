var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var Schema = mongoose.Schema;
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const deleted = [true, false];
const status = ["Active", "Inactive"];

var ProductSchema = new Schema({
  product_id: {
    type: Number
  },
  product_name: {
    type: String,
    default: ''
  },
  product_sku: {
    type: String,
    default: ''
  },
  variant_id: {
    type: Number,
    default: null
  },
  variant_sku: {
    type: String,
    default: ''
  },
  categories: { type : Array , "default" : [] },
  buy_price: {
    type: Number,
    default: 0.00
  },
  wholesale_price: {
    type: Number,
    default: 0.00
  },
  regular_price: {
    type: Number,
    default: 0.00
  },
  sale_price: {
    type: Number,
    default: 0.00
  },
  product_url: {
    type: String,
    default: ''
  },
  images: [Object],
  comp1_product_link: {
    type: String,
    default: ''
  },
  comp1_product_price: {
    type: Number,
    default: 0.00
  },
  comp2_product_link: {
    type: String,
    default: ''
  },
  comp2_product_price: {
    type: Number,
    default: 0.00
  },
  comp3_product_link: {
    type: String,
    default: ''
  },
  comp3_product_price: {
    type: Number,
    default: 0.00
  },
  comp4_product_link: {
    type: String,
    default: ''
  },
  comp4_product_price: {
    type: Number,
    default: 0.00
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
    type: Date
  },
  updatedAt: {
    type: Date
  }
});

// For pagination
ProductSchema.plugin(mongooseAggregatePaginate);

// create the model for users and expose it to our app
module.exports = mongoose.model('Product', ProductSchema);