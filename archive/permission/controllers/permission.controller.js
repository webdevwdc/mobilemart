const Q                   = require('q');
const permissionrRepo     = require('permission/repositories/permission.repository');
const roleRepo            = require('role/repositories/role.repository');

/* @Method: Edit
// @Description: To get all the permission from DB
*/
exports.edit = function(req, res){
   const deferred = Q.defer();
   const roleId = req.params.id
   permissionrRepo.getPermissionByRole(roleId,function (err, result) {
        if (err)
            deferred.reject({ "status": 500, data: [], "message": err });
            roleRepo.getById(roleId,function (err, role_details){
                if(err) {
                   deferred.reject({ "status": 500, data: [], "message": err });
                } else {
                   deferred.resolve({ "status": 200, data: result,role_info:role_details,"message": "Permission Fetched Successfully" });
                }
            })



        
    });
    return deferred.promise;
};

/* @Method: create
// @Description: render permission create page
*/
exports.create = function(req, res){
    const deferred = Q.defer();
    deferred.resolve({ "status": 200, data:[], "message": "Permission Fetched Successfully" });
    return deferred.promise;
};


/* @Method: store
// @Description: permission create action
*/
exports.store = function(req, res){
    
    const deferred = Q.defer();
    permissionrRepo.save(req.body, function (err, result) {
        if (err){
            deferred.reject({ "status": 500, data: [], "message": err });
        }else{
            deferred.resolve({ "status": 200, data: result, "message": "The Permission created successfully" });
        }
    });
    return deferred.promise;
};
exports.update = function(req, res){
    const deferred = Q.defer();
    permissionrRepo.updateRolePermissionById({'role':req.body.pid},req.body, function (err, result) {
        if (err){
            deferred.reject({ "status": 500, data: [], "message": err });
        }else{
            deferred.resolve({ "status": 200, data: result, "message": "Permission Updated Successfully" });
        }
    });
    
    return deferred.promise;
};
