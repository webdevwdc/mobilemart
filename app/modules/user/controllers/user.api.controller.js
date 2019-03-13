const {
    join
} = require('path');
const {
    promisify
} = require('util');
const {
    readFile
} = require('fs');
const gm = require('gm').subClass({ imageMagick: true });
const userRepo = require('user/repositories/user.repository');
const roleRepo = require('role/repositories/role.repository');

const userModel = require('user/models/user.model');
const User = new userModel();
const jwt = require('jsonwebtoken');
const ejs = require('ejs');

const readFileAsync = promisify(readFile);

exports.create = async req => {
    try {
        const roleDetails = await roleRepo.getByField({
            'role': req.body.role
        });

        if (!_.isEmpty(roleDetails)) {
            const userDetails = await userRepo.getAllByField({
                'email': req.body.email
            });

            if (_.isEmpty(userDetails) || _.isNull(userDetails)) {

                req.body.role = roleDetails._id;
                req.body.password = User.generateHash(req.body.password);
                const saveUser = await userRepo.save(req.body);
                const payload = {
                    id: saveUser._id
                };
                const token = jwt.sign(payload, config.jwtSecret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                const user_details = {};
                user_details._id = saveUser._id;
                user_details.firstName = saveUser.firstName;
                user_details.lastName = saveUser.lastName;
                user_details.email = saveUser.email;
                user_details.city = saveUser.city;
                user_details.country_code = saveUser.country_code;
                user_details.state = saveUser.state;
                user_details.gender = saveUser.gender;
                user_details.gender = saveUser.gender;

                return {
                    status: '200',
                    data: user_details,
                    token: token,
                    message: `Account Created Suceessfully`
                };

            } else {
                return {
                    status: '500',
                    data: [],
                    message: 'Email already Exists'
                };
            }

        } else {

            return {
                status: '500',
                data: [],
                message: 'Invalid User type'
            };
        }

    } catch (error) {
        return {
            success: false,
            status: 500,
            data: [],
            "message": 'Something went wrong'
        };
    }
}

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
            user_details._id = user._id;
            user_details.firstName = user.firstName;
            user_details.lastName = user.lastName;
            user_details.email = user.email;
            user_details.role = user.role;

            if (_.has(req.body, 'deviceType') && !_.isEmpty(req.body.deviceType)) {
                let userData = {
                    'deviceType': req.body.deviceType,
                    'deviceToken': req.body.deviceToken
                };
                const updated = await userRepo.updateById(userData, user._id);
            }

            // return the information including token as JSON
            return {
                "status": 200,
                token: token,
                data: user_details,
                "message": "You have successfully logged in"
            };
        } else {
            return {
                "success": false,
                "status": 500,
                data: [],
                "message": 'Authentication failed. Wrong credentials.'
            }
        }
    } catch (error) {
        console.log('80', error);
        return {
            "success": false,
            "status": 500,
            data: [],
            "message": 'Something went wrong'
        }
    }
};

exports.getMyProfile = async req => {
    try {
        const user = await userRepo.getById(req.user._id);
        let totalRidesAsDriver = 0;
        let totalRidesAsRider = 0;
        const resultRidesAsDriver = await tripRepo.getTotalTripAsDriver(req.user._id);
        const resultRidesAsRider = await bookingRepo.getTotalTripAsRider(req.user._id);
        if (resultRidesAsDriver.length > 0) {
            totalRidesAsDriver = resultRidesAsDriver[0].total_rides;
        }
        if (resultRidesAsRider.length > 0) {
            totalRidesAsDriver = resultRidesAsRider[0].total_rides;
        }
        let data = { totalRidesAsDriver: totalRidesAsDriver, totalRidesAsRider: totalRidesAsRider, ...user }
        console.log(data);
        return {
            status: 200,
            data,
            message: 'Profile Info fetched Successfully'
        };
    } catch (error) {
        return {
            "success": false,
            "status": 500,
            data: [],
            "message": 'Something went wrong'
        }
    }
}

exports.updateProfile = async req => {
    try {
        if (req.body.isDriver) {
            let roles = [];
            let userDetails = await userRepo.getById(req.user._id);
            const driverRole = await roleRepo.getByField({
                role: 'driver'
            });
            if (_.isUndefined(userDetails.role.find(r => r._id.toString() === driverRole._id.toString()))) {
                roles.push(userDetails.role[0]._id);
                roles.push(driverRole._id);
                req.body.role = roles;
            }

            if (!_.isEmpty(req.files)) {
                req.body.licenseImage = req.files[0].filename
            }
        }
        const user = await userRepo.updateById(req.body, req.user._id);
        return {
            status: 200,
            data: user,
            message: 'Profile Info updated Successfully'
        };
    } catch (error) {
        return {
            status: 500,
            data: [],
            message: 'Something went wrong'
        };
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const user = await userRepo.getByField({
            email: req.body.email
        });
        if (!_.isEmpty(user)) {
            let random_pass = Math.random().toString(36).substr(2, 9);
            const readable_pass = random_pass;
            random_pass = User.generateHash(random_pass);

            const templateData = {
                user_firstname: user.firstName,
                password: readable_pass
            };
            const ejsTemplate = await readFileAsync(join(__dirname, '../../../', 'views/templates/email.forgot-password.ejs'));
            const html = ejs.render(ejsTemplate.toString(), {
                data: templateData
            });
            await transporter.sendMail({
                from: `Admin<${process.env.MAIL_USERNAME}>`,
                to: req.body.email,
                subject: 'Reset Password | Carpool',
                html: html
            });
            await userRepo.updateById({
                password: random_pass
            }, user._id);
            return {
                status: 200,
                data: [],
                "message": 'Email Sent to provided Email'
            };
        } else {
            return {
                status: 500,
                data: [],
                message: 'No matching User Found'
            };
        }
    } catch (error) {
        return {
            status: 500,
            data: error,
            message: 'Something went wrong'
        };
    }
}

exports.changePassword = async (req, res) => {
    try {
        const user = await userRepo.getById(req.user._id);
        if ((!User.validPassword(req.body.currentPassword, user.password))) {
            return {
                status: 200,
                data: [],
                "message": 'Wrong Current Password'
            };
        } else {
            const newPassword = User.generateHash(req.body.newPassword);
            await userRepo.updateById({
                password: newPassword
            }, req.user._id);
            return {
                status: 200,
                data: [],
                "message": 'Password updated successfully'
            };
        }
    } catch (error) {
        return {
            status: 500,
            data: error,
            message: 'Something went wrong'
        };
    }
}

exports.addImage = async req => {

    try {
        if (!_.isEmpty(req.files)) {
            req.files.forEach(function (file) {
                req.body.profile_image = file.filename;

                gm('public/uploads/user/' + file.filename)
                    .resize(225)
                    .write('public/uploads/user/thumb/' + file.filename, function (err) {
                        if (err) return { status: 200, data: [], message: err };
                        // thumb = file.filename;
                    });
            });
            console.log(req.body)

            const success = await userRepo.updateById(req.body, req.user._id);
            return { status: 200, data: success, message: 'Image Saved Successfully' };
        }
        else {
            //console.log("else");
            return { status: 500, data: [], message: 'Image is required' };
        }

    } catch (error) {
        //console.log("catch");
        console.log('22', error)
        return { status: 500, data: [], message: error };
    }
}