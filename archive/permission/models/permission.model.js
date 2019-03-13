const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deleted = ["yes", "no"];
const status  = ["Active", "Inactive"];

const PermissionSchema = new Schema({
  permission_group: {type: String, default: ''},
  operation: [{ type: String,default: [] }],
  displayName: {type: String, default: ''},
  description: {type: String, default: ''},
  status: { type: String, default: 'Active',enum:status },
  is_deleted: { type: String, default: 'no',enum:deleted }  
});

module.exports = mongoose.model('Permission', PermissionSchema);