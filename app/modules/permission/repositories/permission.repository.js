var mongoose = require('mongoose');
var Permission = require('permission/models/permission.model');
var Role = require('role/models/role.model');
var RolePermission = require('permission/models/role_permission.model');
var perPage = config.PAGINATION_PERPAGE;
var async = require('async');

class permissionRepository {

    async getPermissionByRole(role, cb) {

        var aggregate = Permission.aggregate([

            {
                "$project": {
                    "permission_group": "$permission_group",
                    "operation": "$operation",
                    "displayName": "$displayName",
                    "description": "$description",
                }
            },
            { $group: { _id: "$permission_group", permission_list: { $push: "$$ROOT" } } },
            { "$sort": { _id: -1 } }

        ]).exec(function (err, permResult) {
            if (err) {
                return cb(err.message, null);
            } else {

                var _result = [];

                async.forEachSeries(permResult, function (perm, callbackOne) {
                    async.forEachSeries(perm.permission_list, function (innerPerms, callbackTwo) {
                        var permId = innerPerms._id;
                        RolePermission.findOne({ $and: [{ 'role': role }, { 'permissionall': { $in: [permId] } }] }, function (err, roleInfo) {
                            innerPerms.is_access = (roleInfo != null) ? true : false;
                            callbackTwo();
                        });
                    }, function (err) {
                        if (err) return cb(err.message, null);
                        else {

                            _result.push(perm);
                            callbackOne();
                        }
                    });
                }, function (err) {
                    if (err) return cb(err.message, null);
                    else {
                        return cb(null, _result);
                    }
                });


            }

        })

    }

    async updateRolePermissionById(field, data, cb) {
        RolePermission.findOneAndUpdate(field, data, { upsert: true, 'new': true }, function (err, result) {
            if (err)
                return cb(err, null);
            return cb(null, result);
        });
    }

    async getAll(cb) {
        Permission.find({ status: 'Active' }).sort({ permission_group: -1 }).exec(function (err, result) {
            if (err) {
                return cb(err, null);
            } else {
                return cb(null, result);
            }
        });
    }
    async getRolePermissionByField(params, cb) {
        RolePermission.findOne(params, function (err, result) {
            if (err) {
                return cb(err, null);
            } else {
                return cb(null, result);
            }

        });
    }
    async getById(id, cb) {
        Permission.findById(id, function (err, result) {
            if (err) {
                return cb(err, null);
            } else {
                return cb(null, result);
            }

        });
    }

    async getByField(params) {
        try {
            return await Permission.findOne(params).exec();

        } catch (error) {
            return error;
        }
    }

    async delete(id, cb) {
        Permission.findById(id, function (err, user_details) {
            if (err)
                return cb(err.message, null);

            User.findByIdAndUpdate(id, { isDeleted: 'yes' }, function (err, result) {
                if (err)
                    return cb(err.message, null);
                return cb(null, result);

            });
        });
    }

    async deleteByField(field, fieldValue) {
        //todo: Implement delete by field
    }

    async updateById(data, id, cb) {
        Permission.findByIdAndUpdate(id, data, function (err, result) {
            if (err)
                return cb(err, null);
            return cb(null, result);
        });
    }

    async updateByField(field, fieldValue, data) {
        //todo: update by field
    }

    async save(obj, cb) {
        var newPermission = new Permission(obj);
        newPermission.save(function (err) {
            if (err) {
                return cb(err.message, null);
            } else {
                return cb(null, newPermission);
            }
        });
    }
    async saveRolePermission(obj, cb) {
        var newRolePermission = new RolePermission(obj);
        newRolePermission.save(function (err, newRolePermission) {
            if (err) {
                return cb(err.message, null);
            } else {
                return cb(null, newRolePermission);
            }
        });
    }
}


module.exports = new permissionRepository();