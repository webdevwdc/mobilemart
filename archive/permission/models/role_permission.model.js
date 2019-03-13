const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RolePermissionSchema = new Schema({
  role: { type: Schema.Types.ObjectId, ref: 'Role' },
  permissionall: [{ type: Schema.Types.ObjectId, ref: 'Permission',default: []}]
});

module.exports = mongoose.model('RolePermission', RolePermissionSchema);