define({ "api": [
  {
    "type": "get",
    "url": "/products",
    "title": "Get All Products",
    "version": "0.1.2",
    "group": "Product",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>User's Access Token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{\n    \"status\": 200,\n    \"data\": [{\n            \"_id\": \"5c6598f7a5f62a5381b2c4d6\",\n            \"product_name\": \"Galaxy S7 (G930F) LCD and Digitizer Touch Screen Assembly (Samsung Service Pack) - Rose Gold\",\n            \"product_sku\": \"934721101992\",\n            \"variant_id\": null,\n            \"variant_sku\": \"\",\n            \"buy_price\": 0,\n            \"wholesale_price\": 0,\n            \"regular_price\": 165,\n            \"sale_price\": 165,\n            \"product_url\": \"https://www.mobile-mart.com.au/product/galaxy-s7-g930f-lcd-and-digitizer-touch-screen-assembly-samsung-service-pack-rose-gold/\",\n            \"images\": [\n                {\n                    \"id\": 6148,\n                    \"date_created\": \"2018-11-22T01:04:44\",\n                    \"date_modified\": \"2018-11-22T01:04:44\",\n                    \"src\": \"https://www.mobile-mart.com.au/wp-content/uploads/2018/11/Galaxy-S7-G930F-LCD-and-Digitizer-Touch-Screen-Assembly-Samsung-Service-Pack-Rose-Gold.jpg\",\n                    \"name\": \"Galaxy S7 (G930F) LCD and Digitizer Touch Screen Assembly (Samsung Service Pack) &#8211; Rose Gold\",\n                    \"alt\": \"\",\n                    \"position\": 0\n                }\n            ],\n            \"comp1_product_link\": \"\",\n            \"comp1_product_price\": 0,\n            \"comp2_product_link\": \"\",\n            \"comp2_product_price\": 0,\n            \"comp3_product_link\": \"\",\n            \"comp3_product_price\": 0,\n            \"comp4_product_link\": \"\",\n            \"comp4_product_price\": 0,\n            \"isDeleted\": false,\n            \"status\": \"Active\",\n            \"product_id\": 6146,\n            \"createdAt\": \"2019-02-14T16:36:07.833Z\",\n            \"updatedAt\": \"2019-02-14T16:36:07.833Z\",\n            \"__v\": 0\n        },\n        {\n            \"_id\": \"5c6598f7a5f62a5381b2c4d7\",\n            \"product_name\": \"iPhone X LCD and Digitizer Touch Screen Assembly (AAA Quality) - Black\",\n            \"product_sku\": \"934721101991\",\n            \"variant_id\": null,\n            \"variant_sku\": \"\",\n            \"buy_price\": 0,\n            \"wholesale_price\": 0,\n            \"regular_price\": 250,\n            \"sale_price\": 250,\n            \"product_url\": \"https://www.mobile-mart.com.au/product/iphone-x-lcd-and-digitizer-touch-screen-assembly-aaa-quality-black/\",\n            \"images\": [\n                {\n                    \"id\": 5915,\n                    \"date_created\": \"2018-11-12T04:31:47\",\n                    \"date_modified\": \"2018-11-12T04:31:47\",\n                    \"src\": \"https://www.mobile-mart.com.au/wp-content/uploads/2018/11/HdZjkYr4QA65bkHOUY0D_iPhone_X_LCD_and_Digitizer_Touch_Screen_Assembly__AAA_Quality__-_Black.jpg\",\n                    \"name\": \"HdZjkYr4QA65bkHOUY0D_iPhone_X_LCD_and_Digitizer_Touch_Screen_Assembly__AAA_Quality__-_Black.jpg\",\n                    \"alt\": \"\",\n                    \"position\": 0\n                }\n            ],\n            \"comp1_product_link\": \"\",\n            \"comp1_product_price\": 0,\n            \"comp2_product_link\": \"\",\n            \"comp2_product_price\": 0,\n            \"comp3_product_link\": \"\",\n            \"comp3_product_price\": 0,\n            \"comp4_product_link\": \"\",\n            \"comp4_product_price\": 0,\n            \"isDeleted\": false,\n            \"status\": \"Active\",\n            \"product_id\": 5914,\n            \"createdAt\": \"2019-02-14T16:36:07.849Z\",\n            \"updatedAt\": \"2019-02-14T16:36:07.849Z\",\n            \"__v\": 0\n        }],\n    \"message\": \"Products Fetched Successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/api/product.routes.js",
    "groupTitle": "Product",
    "name": "GetProducts"
  },
  {
    "type": "get",
    "url": "/products/startCron",
    "title": "For Start Cron",
    "version": "0.1.2",
    "group": "Product",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{ status: 200, data: [], message: 'Cron Started Successfully' }",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/api/product.routes.js",
    "groupTitle": "Product",
    "name": "GetProductsStartcron"
  },
  {
    "type": "get",
    "url": "/products/stopCron",
    "title": "For Stop Cron",
    "version": "0.1.2",
    "group": "Product",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{ status: 200, data: [], message: 'Cron Stopped Successfully' }",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/api/product.routes.js",
    "groupTitle": "Product",
    "name": "GetProductsStopcron"
  },
  {
    "type": "GET",
    "url": "/users/myprofile",
    "title": "User's Profile",
    "version": "1.0.0",
    "group": "Users",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>User's Access token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{\n    \"status\": 200,\n    \"data\": {\n       \"totalRidesAsDriver\": 1,\n        \"totalRidesAsRider\": 0,\n        \"_id\": \"5c2f6a71d5f97fa0c7d43f7e\",\n        \"role\": {\n            \"_id\": \"5c2f1915d5f97fa0c7d08898\",\n            \"role\": \"driver\",\n            \"desc\": \"<p>This is the Driver role here.</p>\\r\\n\",\n            \"roleDisplayName\": \"Driver\"\n        },\n        \"firstName\": \"Driver\",\n        \"lastName\": \"A \",\n        \"username\": \"testD1\",\n        \"email\": \"test@driver.net\",\n        \"password\": \"$2a$08$jXoGyiuSej7xFGf3EWux3udQlU42heFNJGa23tY8aAjnkxzeSi7Ni\",\n        \"postalCode\": 725825,\n        \"dob\": \"21/01/1990\",\n        \"city\": \"5c486a537a85334c48349cd2\",\n        \"state\": \"5b8d0c36d7ff3b08223dbc6c\",\n        \"country_code\": \"usa\",\n        \"gender\": \"male\",\n        \"licenseNumber\": \"\",\n        \"licenseImage\": \"\",\n        \"profile_image\": \"\",\n        \"device_token\": \"\",\n        \"device_type\": \"\",\n        \"push_notification\": \"No\",\n        \"status\": \"Active\",\n        \"isDeleted\": false,\n        \"profileVerified\": false,\n        \"emailVerified\": true,\n        \"licenseVerified\": false,\n        \"mobileVerified\": false,\n        \"__v\": 0,\n        \"contactNumber\": \"3216547890\",\n        \"address\": \"Arizona \",\n        \"latitude\": \"22.845680\",\n        \"longitude\": \"88.895647\",\n        \"bio\": \"euiofhushrfseurhaw3ui4ryhwu34yhw3ui4ya3wui\",\n        \"rating\": 3.3,\n        \"creditAmount\": 15.5,\n        \"referralCode\": \"YIWQTE458689I\",\n        \"walletAmount\": 12.29\n    },\n    \"message\": \"Profile Info fetched Successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/api/user.routes.js",
    "groupTitle": "Users",
    "name": "GetUsersMyprofile"
  },
  {
    "type": "post",
    "url": "/user/create",
    "title": "Create a user",
    "version": "1.0.0",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "role",
            "defaultValue": "driver,rider",
            "description": "<p>User Role</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "email",
            "description": "<p>User Email</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "firstName",
            "description": "<p>User First name</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "lastName",
            "description": "<p>User Last Name</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "contactNumber",
            "description": "<p>User Contact Number</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "password",
            "description": "<p>User password</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "city",
            "description": "<p>User City</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "country_code",
            "description": "<p>User country</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "state",
            "description": "<p>User state</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "gender",
            "description": "<p>User gender</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{\n    \"status\": \"200\",\n    \"data\": {\n        \"_id\": \"5c35a4bd7fa43d2a091c001f\",\n        \"firstName\": \"Test\",\n        \"lastName\": \"Driver E\",\n        \"email\": \"test5@driver.net\"\n    },\n    \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMzVhNGJkN2ZhNDNkMmEwOTFjMDAxZiIsImlhdCI6MTU0NzAxOTQ1MywiZXhwIjoxNTQ3MTA1ODUzfQ.g96mDJGo-rg3TkawjkVdZbgMrYCIUUYMgD-mtDumZGg\",\n    \"message\": \"Account Created Suceessfully\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/api/user.routes.js",
    "groupTitle": "Users",
    "name": "PostUserCreate"
  },
  {
    "type": "post",
    "url": "/user/resetpassword",
    "title": "Reset User's Password",
    "version": "1.0.0",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "email",
            "description": "<p>User's account Email</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{\n    \"status\": 200,\n    \"data\": [],\n    \"message\": \"Email Sent to provided Email\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/api/user.routes.js",
    "groupTitle": "Users",
    "name": "PostUserResetpassword"
  },
  {
    "type": "post",
    "url": "/user/signin",
    "title": "Signin a user",
    "version": "1.0.0",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "email",
            "description": "<p>User's account Email</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "password",
            "description": "<p>User's account Password</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{\n    \"status\": 200,\n    \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMzVhNGJkN2ZhNDNkMmEwOTFjMDAxZiIsImlhdCI6MTU0NzAxOTgyNCwiZXhwIjoxNTQ3MTA2MjI0fQ.-8pJ2JWQ2OEi_-N9IWDR2IUsnzKt2RKDg_grcDPG-_Q\",\n    \"data\": {\n        \"_id\": \"5c35a4bd7fa43d2a091c001f\",\n        \"firstName\": \"Test\",\n        \"lastName\": \"Driver E\",\n        \"email\": \"test5@driver.net\",\n        \"role\": [\n            {\n                \"desc\": \"<p>This is the Passenger role here.</p>\\r\\n\",\n                \"_id\": \"5c2f385dd5f97fa0c7d1f0f6\",\n                \"role\": \"rider\",\n                \"roleDisplayName\": \"Rider\",\n                \"rolepermission\": null,\n                \"user_data\": null,\n                \"id\": \"5c2f385dd5f97fa0c7d1f0f6\"\n            },\n            {\n                \"desc\": \"<p>This is the Driver role here.</p>\\r\\n\",\n                \"_id\": \"5c2f1915d5f97fa0c7d08898\",\n                \"role\": \"driver\",\n                \"roleDisplayName\": \"Driver\",\n                \"rolepermission\": null,\n                \"user_data\": null,\n                \"id\": \"5c2f1915d5f97fa0c7d08898\"\n            }\n        ]\n    },\n    \"message\": \"You have successfully logged in\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/api/user.routes.js",
    "groupTitle": "Users",
    "name": "PostUserSignin"
  },
  {
    "type": "post",
    "url": "/users/addImage",
    "title": "add profile image",
    "version": "1.0.0",
    "group": "Users",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>User's Access Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "image",
            "description": "<p>profile image</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{\n    \"status\": 200,\n    \"data\": {\n        \"profileImage\": \"image_1549378050383_tiger.jpeg\",\n        \"firstName\": \"\",\n        \"lastName\": \"\",\n        \"email\": \"\",\n        \"dob\": \"\",\n        \"password\": \"\",\n        \"contactNumber\": \"\",\n        \"country_code\": \"\",\n        \"gender\": \"\",\n        \"postalCode\": null,\n        \"role\": [],\n        \"regType\": \"normal\",\n        \"address\": \"\",\n        \"country\": \"\",\n        \"latitude\": \"\",\n        \"longitude\": \"\",\n        \"licenseNumber\": \"\",\n        \"licenseImage\": \"\",\n        \"rating\": 0,\n        \"bio\": \"\",\n        \"deviceToken\": \"\",\n        \"deviceType\": \"\",\n        \"token\": \"\",\n        \"walletAmount\": \"\",\n        \"paymentMethod\": \"\",\n        \"creditAmount\": 0,\n        \"referralCode\": \"\",\n        \"isDeleted\": false,\n        \"status\": \"Active\",\n        \"profileVerified\": false,\n        \"emailVerified\": false,\n        \"licenseVerified\": false,\n        \"mobileVerified\": false,\n        \"createdAt\": \"2019-02-05T14:47:30.401Z\",\n        \"_id\": \"5c59a202e1054c4ef9e56109\",\n        \"__v\": 0\n    },\n    \"message\": \"Image Saved Successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/api/user.routes.js",
    "groupTitle": "Users",
    "name": "PostUsersAddimage"
  },
  {
    "type": "post",
    "url": "/users/changepassword",
    "title": "Change User's Password",
    "version": "1.0.0",
    "group": "Users",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>User's Access Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "currentPassword",
            "description": "<p>user's Current password</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "newPassword",
            "description": "<p>new password</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{\n    \"status\": 200,\n    \"data\": [],\n    \"message\": \"Password updated successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/api/user.routes.js",
    "groupTitle": "Users",
    "name": "PostUsersChangepassword"
  },
  {
    "type": "post",
    "url": "/users/updateprofile",
    "title": "Update User's Profile",
    "version": "1.0.0",
    "group": "Users",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>User's Access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "firstName",
            "description": "<p>User's First Name</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "lastName",
            "description": "<p>User's Last Name</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "contactNumber",
            "description": "<p>User's Contact Number</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "dob",
            "description": "<p>User's Date Of Birth</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "email",
            "description": "<p>User's Email Address</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "gender",
            "description": "<p>User's Gender</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "country_code",
            "description": "<p>User's Country</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "state",
            "description": "<p>User's State</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "city",
            "description": "<p>User's City</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "postalCode",
            "description": "<p>User's Postal Code</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "address",
            "description": "<p>User's Home Address</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "licenseNumber",
            "description": "<p>User's License Number</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "licenseImage",
            "description": "<p>User's License Image</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "isDriver",
            "description": "<p>Send true if it's driver or send false</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{\n    \"status\": 200,\n    \"data\": {\n        \"firstName\": \"Driver\",\n        \"lastName\": \"AA\",\n        \"email\": \"test@driver.net\",\n        \"dob\": \"21/01/1990\",\n        \"password\": \"$2a$08$jXoGyiuSej7xFGf3EWux3udQlU42heFNJGa23tY8aAjnkxzeSi7Ni\",\n        \"contactNumber\": \"3216547890\",\n        \"country_code\": \"usa\",\n        \"gender\": \"male\",\n        \"postalCode\": 725825,\n        \"role\": [\n            {\n                \"desc\": \"<p>This is the Driver role here.</p>\\r\\n\",\n                \"_id\": \"5c2f1915d5f97fa0c7d08898\",\n                \"role\": \"driver\",\n                \"roleDisplayName\": \"Driver\",\n                \"rolepermission\": null,\n                \"user_data\": null,\n                \"id\": \"5c2f1915d5f97fa0c7d08898\"\n            }\n        ],\n        \"regType\": \"normal\",\n        \"address\": \"Arizona \",\n        \"country\": \"\",\n        \"latitude\": \"22.845680\",\n        \"longitude\": \"88.895647\",\n        \"profileImage\": \"\",\n        \"licenseNumber\": \"\",\n        \"licenseImage\": \"\",\n        \"rating\": 3.3,\n        \"bio\": \"euiofhushrfseurhaw3ui4ryhwu34yhw3ui4ya3wui\",\n        \"deviceToken\": \"\",\n        \"deviceType\": \"\",\n        \"token\": \"\",\n        \"walletAmount\": \"12.29\",\n        \"paymentMethod\": \"\",\n        \"creditAmount\": 15.5,\n        \"referralCode\": \"YIWQTE458689I\",\n        \"isDeleted\": false,\n        \"status\": \"Active\",\n        \"profileVerified\": false,\n        \"emailVerified\": true,\n        \"licenseVerified\": false,\n        \"mobileVerified\": false,\n        \"createdAt\": \"2019-01-29T10:55:04.169Z\",\n        \"_id\": \"5c2f6a71d5f97fa0c7d43f7e\",\n        \"username\": \"testD1\",\n        \"city\": \"5c486a537a85334c48349cd2\",\n        \"state\": \"5b8d0c36d7ff3b08223dbc6c\",\n        \"profile_image\": \"\",\n        \"device_token\": \"\",\n        \"device_type\": \"\",\n        \"push_notification\": \"No\",\n        \"__v\": 0\n    },\n    \"message\": \"Profile Info updated Successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/api/user.routes.js",
    "groupTitle": "Users",
    "name": "PostUsersUpdateprofile"
  }
] });
