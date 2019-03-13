const userRepo = require('user/repositories/user.repository');
const cmsRepo = require('cms/repositories/cms.repository');
const roleRepo = require('role/repositories/role.repository');
const User = require('user/models/user.model');

const jwt = require('jsonwebtoken');

/* @Method: login
// @Description: user Login Render
*/
exports.login = (req, res) => res.render('user/views/login.ejs');

/* @Method: signin
// @Description: user Login
*/
exports.signin = async req => {
    try {
        // find the user
        const user = await userRepo.fineOneWithRole(req.body);
        if (!_.isEmpty(user.role)) {
            const payload = {
                id: user._id
            };
            const token = jwt.sign(payload, config.jwtSecret, {
                expiresIn: 86400 // expires in 24 hours
            });
            req.session.token = token;
            req.user = user;
            const user_details = {};
            user_details.id = user._id;
            user_details.name = user.name;
            user_details.email = user.email;
            // return the information including token as JSON
            return {
                "status": 200,
                token: token,
                data: [user_details],
                "message": "You have successfully logged in"
            };
        } else {
            throw new Error('Authentication failed. Wrong credentials.')
        }
    } catch (error) {
        throw error;
    }
};

/* @Method: Create
// @Description: user create Render
*/
exports.create = async req => {
    try {
        const result = await roleRepo.getAllByField({
            'role': {
                $nin: ["admin"]
            }
        });
        return {
            "status": 200,
            data: result,
            "message": req.flash('info')
        };
    } catch (error) {
        return {
            "status": 500,
            data: [],
            "message": error
        };
    }
};

/* @Method: store
// @Description: user create action
*/
exports.store = async req => {
    try {
        const result = await userRepo.getByField({
            'email': req.body.email,
            'isDeleted': false
        });
        if (_.isEmpty(result)) {
            const role = await roleRepo.getByField({
                "role": "user"
            });
            req.body.role = role._id;
            req.body.password = req.user.generateHash(req.body.password);
            const result = await userRepo.save(req.body);
            return {
                "status": 200,
                data: result,
                "message": "User Created Successfully"
            };
        } else {
            throw new Error('This email address is already exist!');
        }
    } catch (error) {
        throw error;
    }
};


/*
// @Method: edit
// @Description:  render user update page
*/
exports.edit = async req => {
    try {
        const result = await userRepo.getById(req.params.id);
        const role_list = await roleRepo.getAllByField({
            'role': {
                $nin: ["admin"]
            }
        });
        result.role_list = role_list;
        return {
            "status": 200,
            data: result,
            "message": "User Fetched Successfully"
        }
    } catch (error) {
        return {
            "status": 500,
            data: [],
            "message": err
        };
    }
};

/* @Method: update
// @Description: user update action
*/
exports.update = async req => {
    try {
        const result = await userRepo.getByField({
            'email': req.body.email,
            'isDeleted': false,
            '_id': {
                $ne: req.body.user_id
            }
        });
        if (_.isEmpty(result)) {
            await userRepo.getUser(req.body.user_id);
            const result2 = await userRepo.updateById(req.body, req.body.user_id);
            return {
                "status": 200,
                data: result2,
                "message": "User Updated Successfully"
            };
        } else {
            return new Error({
                "status": 500,
                data: [],
                "message": "This email address is already exist!"
            });
        }
    } catch (error) {
        return {
            "status": 500,
            data: [],
            "message": error
        };
    }
};

/* @Method: list
// @Description: To get all the users from DB
*/
exports.list = async req => {
    try {
        const currentPage = req.query.page || 1;
        const {
            data,
            pageCount,
            totalCount
        } = await userRepo.getAllUsersByRolename(req.query, req.user, {
            '_id': -1
        }, currentPage, req.userrole);
        const role_all = await roleRepo.getAllByField({
            'role': {
                $nin: ["user"]
            }
        });
        return {
            "status": 200,
            role_list: role_all,
            data,
            current: currentPage,
            pages: pageCount,
            "message": "Data Fetched Successfully"
        };
    } catch (error) {
        return {
            "status": 500,
            data: [],
            "message": error
        };
    }
};

/* @Method: Dashboard
// @Description: User Dashboard
*/
exports.dashboard = async req => {
    const responseObj = {};
    try {
        responseObj.driver_count = await userRepo.getDriverCount(req.body);
        responseObj.passenger_count = await userRepo.getPassengerCount(req.body);
        responseObj.cms_count = await cmsRepo.getCmsCount(req.body);
        return {
            "status": 200,
            data: responseObj,
            "message": "Dashboard Fetched Successfully"
        };
    } catch (error) {
        return {
            "status": 500,
            data: [],
            "message": error
        };
    }
};

/* @Method: Logout
// @Description: User Logout
*/
exports.logout = async (req, res) => req.session.destroy(() => res.redirect('/'));

/* @Method: viewmyprofile
// @Description: To get Profile Info from db
*/
exports.viewmyprofile = async req => {
    try {
        const id = req.params.id;
        const user = await userRepo.getById(id);
        return {
            "status": 200,
            data: user,
            "message": "Profile Fetched Successfully"
        };
    } catch (error) {
        return {
            "status": 500,
            data: [],
            "message": error
        };
    }
};

/* @Method: updateprofile
// @Description: Update My Profile 
*/
exports.updateprofile = async req => {
    try {
        const id = req.body.id;
        const result = await userRepo.updateById(req.body, id);
        return {
            "status": 200,
            data: result,
            "message": "Profile updated successfully"
        }
    } catch (error) {
        return {
            "status": 500,
            data: [],
            "message": error
        }
    }
};

/*
// @Method: statusChange
// @Description: User status change action
*/
exports.statusChange = async req => {
    try {
        const result = await userRepo.getById(req.body.id);
        const updatedStatus = (_.has(result, 'status') && result.status == "Inactive") ? "Active" : "Inactive";
        await userRepo.updateById({
            'status': updatedStatus
        }, req.body.id);
        return {
            "status": 200,
            data: result,
            "message": "User status has changed successfully"
        };
    } catch (error) {
        return {
            "status": 500,
            data: [],
            "message": error
        };
    }
};

/*
// @Method: changepassword
// @Description: User password change
*/
exports.changepassword = async req => {
    try {
        const user = await userRepo.getById(req.body.id);
        if (!user) {
            throw new Error('Authentication failed. User not found.');
        } else {
            const UserModel = new User();
            // check if password matches
            if (!UserModel.validPassword(req.body.old_password, user.password)) {
                throw new Error('Authentication failed. Wrong password.');
            } else {
                // if user is found and password is right, check if he is an admin
                const new_password = req.user.generateHash(req.body.password);
                await userRepo.updateById({
                    "password": new_password
                }, req.body.id);
                return {
                    "status": 200,
                    data: [user],
                    "message": "Your password has been changed successfully"
                }

            }
        }
    } catch (error) {
        throw error;
    }
};

/*
// @Method: forgotPassword
// @Description: User forgotPassword
*/
exports.forgotPassword = async req => {
    try {
        const result = await userRepo.forgotPassword(req.body);
        await transporter.sendMail({
            from: 'Admin<smith.williams0910@gmail.com>',
            to: req.body.email_p_c,
            // to: 'uday.mishra@webskitters.com',
            subject: 'Admin New Password',
            html: `Your password has been updated.<br>New password: <b>` + result + `</b><br>Thank you.`
        });
        return {
            "status": 200,
            data: [result],
            "message": "Check Email For New Password"
        };
    } catch (error) {
        throw error;
    }
};

exports.userProject = async req => {
    try {
        const result = await projectRepo.userProject({
            user_id: req.params.id
        });
        return {
            "status": 200,
            data: result,
            "message": "User projects fetched  successfully"
        };
    } catch (error) {
        return {
            "status": 500,
            data: [],
            "message": error
        };
    }
};

/* @Method: delete
// @Description: User delete
*/
exports.destroy = async req => {
    try {
        await userRepo.delete(req.params.id);
        return {
            "status": 200,
            data: result,
            "message": "User Removed Successfully"
        };
    } catch (error) {
        return {
            "status": 500,
            data: [],
            "message": error
        };
    }
};