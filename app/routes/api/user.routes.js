const express = require('express');
const routeLabel = require('route-label');
const multer = require('multer');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');

const userController = require('user/controllers/user.api.controller');

//const request_param = multer();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if ((file.fieldname).indexOf('license') > -1) {
      // check if directory exists
      if (!fs.existsSync('./public/uploads/license')) {
        // if not create directory
        fs.mkdirSync('./public/uploads/license');

      }
      cb(null, './public/uploads/license')
    } else {
      // check if directory exists
      if (!fs.existsSync('./public/uploads/user')) {
        // if not create directory
        fs.mkdirSync('./public/uploads/user');

      }
      cb(null, './public/uploads/user')
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
  }
})
const request_param = multer({ storage: storage });

//username:testD4
/**
 * @api {post} /user/create Create a user
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiParam role="driver,rider" User Role
 * @apiParam email User Email
 * @apiParam firstName User First name
 * @apiParam lastName User Last Name
 * @apiParam contactNumber User Contact Number
 * @apiParam password User password
 * @apiParam city User City
 * @apiParam country_code User country
 * @apiParam state User state
 * @apiParam gender User gender
 * @apiSuccessExample {json} Success
 * {
    "status": "200",
    "data": {
        "_id": "5c35a4bd7fa43d2a091c001f",
        "firstName": "Test",
        "lastName": "Driver E",
        "email": "test5@driver.net"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMzVhNGJkN2ZhNDNkMmEwOTFjMDAxZiIsImlhdCI6MTU0NzAxOTQ1MywiZXhwIjoxNTQ3MTA1ODUzfQ.g96mDJGo-rg3TkawjkVdZbgMrYCIUUYMgD-mtDumZGg",
    "message": "Account Created Suceessfully"
}
*/
namedRouter.post("api.user.create", '/user/create', request_param.any(), async (req, res) => {
  try {
    const success = await userController.create(req);
    res.status(success.status).send(success);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

/**
 * @api {post} /user/signin Signin a user
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiParam email User's account Email
 * @apiParam password User's account Password
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMzVhNGJkN2ZhNDNkMmEwOTFjMDAxZiIsImlhdCI6MTU0NzAxOTgyNCwiZXhwIjoxNTQ3MTA2MjI0fQ.-8pJ2JWQ2OEi_-N9IWDR2IUsnzKt2RKDg_grcDPG-_Q",
    "data": {
        "_id": "5c35a4bd7fa43d2a091c001f",
        "firstName": "Test",
        "lastName": "Driver E",
        "email": "test5@driver.net",
        "role": [
            {
                "desc": "<p>This is the Passenger role here.</p>\r\n",
                "_id": "5c2f385dd5f97fa0c7d1f0f6",
                "role": "rider",
                "roleDisplayName": "Rider",
                "rolepermission": null,
                "user_data": null,
                "id": "5c2f385dd5f97fa0c7d1f0f6"
            },
            {
                "desc": "<p>This is the Driver role here.</p>\r\n",
                "_id": "5c2f1915d5f97fa0c7d08898",
                "role": "driver",
                "roleDisplayName": "Driver",
                "rolepermission": null,
                "user_data": null,
                "id": "5c2f1915d5f97fa0c7d08898"
            }
        ]
    },
    "message": "You have successfully logged in"
}
*/
namedRouter.post("api.user.signin", '/user/signin', request_param.any(), async (req, res) => {
  try {
    const success = await userController.signin(req);
    res.status(success.status).send(success);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

/**
 * @api {post} /user/resetpassword Reset User's Password
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiParam email User's account Email
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": [],
    "message": "Email Sent to provided Email"
}
*/
namedRouter.post("api.user.resetpassword", '/user/resetpassword', request_param.any(), async (req, res) => {
  try {
    const success = await userController.resetPassword(req, res);
    res.status(success.status).send(success);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

namedRouter.all('/users*', auth.authenticateAPI);

/**
 * @api {GET} /users/myprofile User's Profile
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader x-access-token User's Access token
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
       "totalRidesAsDriver": 1,
        "totalRidesAsRider": 0,
        "_id": "5c2f6a71d5f97fa0c7d43f7e",
        "role": {
            "_id": "5c2f1915d5f97fa0c7d08898",
            "role": "driver",
            "desc": "<p>This is the Driver role here.</p>\r\n",
            "roleDisplayName": "Driver"
        },
        "firstName": "Driver",
        "lastName": "A ",
        "username": "testD1",
        "email": "test@driver.net",
        "password": "$2a$08$jXoGyiuSej7xFGf3EWux3udQlU42heFNJGa23tY8aAjnkxzeSi7Ni",
        "postalCode": 725825,
        "dob": "21/01/1990",
        "city": "5c486a537a85334c48349cd2",
        "state": "5b8d0c36d7ff3b08223dbc6c",
        "country_code": "usa",
        "gender": "male",
        "licenseNumber": "",
        "licenseImage": "",
        "profile_image": "",
        "device_token": "",
        "device_type": "",
        "push_notification": "No",
        "status": "Active",
        "isDeleted": false,
        "profileVerified": false,
        "emailVerified": true,
        "licenseVerified": false,
        "mobileVerified": false,
        "__v": 0,
        "contactNumber": "3216547890",
        "address": "Arizona ",
        "latitude": "22.845680",
        "longitude": "88.895647",
        "bio": "euiofhushrfseurhaw3ui4ryhwu34yhw3ui4ya3wui",
        "rating": 3.3,
        "creditAmount": 15.5,
        "referralCode": "YIWQTE458689I",
        "walletAmount": 12.29
    },
    "message": "Profile Info fetched Successfully"
}
*/

namedRouter.get('api.user.myprofile', '/users/myprofile', async (req, res) => {
  try {
    const success = await userController.getMyProfile(req);
    res.status(success.status).send(success);
  } catch (error) {
    res,
      status(error.status).send(error);
  }
});

/**
 * @api {post} /users/updateprofile Update User's Profile
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader x-access-token User's Access token
 * @apiParam firstName User's First Name
 * @apiParam lastName User's Last Name
 * @apiParam contactNumber User's Contact Number
 * @apiParam dob User's Date Of Birth
 * @apiParam email User's Email Address
 * @apiParam gender User's Gender
 * @apiParam country_code User's Country
 * @apiParam state User's State
 * @apiParam city User's City
 * @apiParam postalCode User's Postal Code
 * @apiParam address User's Home Address
 * @apiParam licenseNumber User's License Number
 * @apiParam licenseImage User's License Image
 * @apiParam isDriver Send true if it's driver or send false 
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "firstName": "Driver",
        "lastName": "AA",
        "email": "test@driver.net",
        "dob": "21/01/1990",
        "password": "$2a$08$jXoGyiuSej7xFGf3EWux3udQlU42heFNJGa23tY8aAjnkxzeSi7Ni",
        "contactNumber": "3216547890",
        "country_code": "usa",
        "gender": "male",
        "postalCode": 725825,
        "role": [
            {
                "desc": "<p>This is the Driver role here.</p>\r\n",
                "_id": "5c2f1915d5f97fa0c7d08898",
                "role": "driver",
                "roleDisplayName": "Driver",
                "rolepermission": null,
                "user_data": null,
                "id": "5c2f1915d5f97fa0c7d08898"
            }
        ],
        "regType": "normal",
        "address": "Arizona ",
        "country": "",
        "latitude": "22.845680",
        "longitude": "88.895647",
        "profileImage": "",
        "licenseNumber": "",
        "licenseImage": "",
        "rating": 3.3,
        "bio": "euiofhushrfseurhaw3ui4ryhwu34yhw3ui4ya3wui",
        "deviceToken": "",
        "deviceType": "",
        "token": "",
        "walletAmount": "12.29",
        "paymentMethod": "",
        "creditAmount": 15.5,
        "referralCode": "YIWQTE458689I",
        "isDeleted": false,
        "status": "Active",
        "profileVerified": false,
        "emailVerified": true,
        "licenseVerified": false,
        "mobileVerified": false,
        "createdAt": "2019-01-29T10:55:04.169Z",
        "_id": "5c2f6a71d5f97fa0c7d43f7e",
        "username": "testD1",
        "city": "5c486a537a85334c48349cd2",
        "state": "5b8d0c36d7ff3b08223dbc6c",
        "profile_image": "",
        "device_token": "",
        "device_type": "",
        "push_notification": "No",
        "__v": 0
    },
    "message": "Profile Info updated Successfully"
}
*/

namedRouter.post('api.user.updateprofile', '/users/updateprofile', request_param.any(), async (req, res) => {
  try {
    const success = await userController.updateProfile(req);
    res.status(success.status).send(success);
  } catch (error) {
    res,
      status(error.status).send(error);
  }
});

/**
 * @api {post} /users/changepassword Change User's Password
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader x-access-token User's Access Token
 * @apiParam currentPassword user's Current password
 * @apiparam newPassword new password
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": [],
    "message": "Password updated successfully"
}
*/
namedRouter.post("api.user.changepassword", '/users/changepassword', request_param.any(), async (req, res) => {
  try {
    const success = await userController.changePassword(req, res);
    res.status(success.status).send(success);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

/**
 * @api {post} /users/addImage add profile image 
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader x-access-token User's Access Token
 * @apiparam image profile image
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "profileImage": "image_1549378050383_tiger.jpeg",
        "firstName": "",
        "lastName": "",
        "email": "",
        "dob": "",
        "password": "",
        "contactNumber": "",
        "country_code": "",
        "gender": "",
        "postalCode": null,
        "role": [],
        "regType": "normal",
        "address": "",
        "country": "",
        "latitude": "",
        "longitude": "",
        "licenseNumber": "",
        "licenseImage": "",
        "rating": 0,
        "bio": "",
        "deviceToken": "",
        "deviceType": "",
        "token": "",
        "walletAmount": "",
        "paymentMethod": "",
        "creditAmount": 0,
        "referralCode": "",
        "isDeleted": false,
        "status": "Active",
        "profileVerified": false,
        "emailVerified": false,
        "licenseVerified": false,
        "mobileVerified": false,
        "createdAt": "2019-02-05T14:47:30.401Z",
        "_id": "5c59a202e1054c4ef9e56109",
        "__v": 0
    },
    "message": "Image Saved Successfully"
}
*/


namedRouter.post("api.user.addImage", '/users/addImage', request_param.any(), function (req, res) {
  userController.addImage(req).then(function (success) {
    res.status(success.status).send(success);
  }, function (failure) {
    res.status(failure.status).send(failure);
  });
});

module.exports = router;