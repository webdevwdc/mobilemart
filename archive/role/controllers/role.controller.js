const Q = require('q');
const roleRepo = require('role/repositories/role.repository');
const rolePermissionRepo = require('permission/repositories/permission.repository');
const slug = require('slug')

/* @Method: list
// @Description: To get all the role from DB
*/
exports.list = function (req, res) {
    const deferred = Q.defer();
    const currentPage = req.query.page || 1;
    roleRepo.getAll(req.query, currentPage, function (err, result) {
        if (err)
            deferred.reject({ "status": 500, data: [], "message": err });
        deferred.resolve({ "status": 200, data: result.docs, current: currentPage, pages: result.pages, "message": "Role Fetched Successfully" });
    });
    return deferred.promise;
};


/* @Method: create
// @Description: render role create page
*/
exports.create = function (req, res) {
    const deferred = Q.defer();
    deferred.resolve({ "status": 200, data: [], "message": "Role Fetched Successfully" });
    return deferred.promise;
};


/* @Method: store
// @Description: role create action
*/
exports.store = function (req, res) {
    const deferred = Q.defer();
    const permissionObj = {};
    roleRepo.getByField({ 'roleDisplayName': { '$regex': req.body.roleDisplayName, '$options': 'i' } }, function (err, result) {
        if (err) {
            deferred.reject({ "status": 500, data: [], "message": err });
        }
        else {
            if (_.isEmpty(result)) {
                req.body.role = slug(req.body.roleDisplayName, { lower: true, replacement: '_' });
                roleRepo.save(req.body, function (err, new_role) {
                    if (err) {
                        deferred.reject({ "status": 500, data: [], "message": err });
                    } else {
                        permissionObj.role = new_role._id;
                        rolePermissionRepo.saveRolePermission(permissionObj, function (err, result) {
                            if (err) {
                                deferred.reject({ "status": 500, data: [], "message": err });
                            } else {
                                deferred.resolve({ "status": 200, data: new_role, "message": "The role created successfully" });

                            }
                        })
                    }
                });
            } else {

                deferred.reject({ "status": 500, data: [], "message": "This role is already exist!" });
            }
        }
    });
    return deferred.promise;
};

/*
// @Method: edit
// @Description:  render role update page
*/
exports.edit = function (req, res) {
    const deferred = Q.defer();
    roleRepo.getById(req.params.id, function (err, result) {
        if (err)
            deferred.reject({ "status": 500, data: [], "message": err });
        deferred.resolve({ "status": 200, data: result, "message": "Role Fetched Successfully" });

    });
    return deferred.promise;
};

/* @Method: update
// @Description: role update action
*/
exports.update = function (req, res) {
    const deferred = Q.defer();
    roleRepo.getByField({ 'roleDisplayName': req.body.roleDisplayName, '_id': { $ne: req.body.rid } }, function (err, result) {
        if (err) {
            deferred.reject({ "status": 500, data: [], "message": err });
        }
        else {
            if (_.isEmpty(result)) {

                roleRepo.updateById(req.body, req.body.rid, function (err, result) {
                    if (err) {
                        deferred.reject({ "status": 500, data: [], "message": err });
                    } else {
                        deferred.resolve({ "status": 200, data: result, "message": "Role Updated Successfully" });
                    }
                });
            } else {

                deferred.reject({ "status": 500, data: [], "message": "This role is already exist!" });
            }
        }

    });

    return deferred.promise;
};