let _ = require("underscore");
var userRepo = require('user/repositories/user.repository');
var permissionrRepo = require('permission/repositories/permission.repository');

class UserAccess {
    async findIsAccess(role, permission) {
        try {
            const permissionDetails = await permissionrRepo.getByField({ 'operation': { $in: [permission] } });
            return await userRepo.findIsAccess(role, permissionDetails._id);
        } catch (error) {
            return error;
        }
    }
}

module.exports = new UserAccess();



