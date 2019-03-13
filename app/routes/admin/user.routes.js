const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require('querystring');
const multer = require('multer');
const userController = require('user/controllers/user.controller');
const productController = require('product/controllers/product.controller');

const Storage = multer.diskStorage({
	destination: (req, file, callback) => {
		if (file.fieldname === 'banner_image') {
			callback(null, "./public/uploads/user/banner")
		} else {
			callback(null, "./public/uploads/user");
		}
	},
	filename: (req, file, callback) => {
		callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
	}
});

const uploadFile = multer({
	storage: Storage
});
const request_param = multer();

// 

// Register routing as usual + label
namedRouter.get('user.login', '/', userController.login);

namedRouter.post("user.login.process", '/login', request_param.any(), async (req, res) => {
	try {
		const success = await userController.signin(req);
		req.flash('success', success.message);
		return res.redirect(namedRouter.urlFor('user.dashboard'));
	} catch (error) {
		req.flash('error', error.message);
		return res.redirect(namedRouter.urlFor('user.login'));
	}
});

// ObjectId("5c2f1915d5f97fa0c7d08898")
/*
// @Route: Users Forgotpassowrd [Admin]
*/
namedRouter.post('user.forgotPass.process', '/user/forgotpassword', request_param.any(), async (req, res) => {
	try {
		const success = await userController.forgotPassword(req);
		req.flash('success', success.message);
		return res.redirect(namedRouter.urlFor('user.login'));
	} catch (error) {
		req.flash('error', error.message);
		return res.redirect(namedRouter.urlFor('user.login'));
	}
});

namedRouter.get('user.logout', "/logout", userController.logout);
namedRouter.all('/*', auth.authenticate);

/*
// @Route: Users Dashboard [Admin]
*/
namedRouter.get("user.dashboard", '/dashboard', async (req, res) => {
	try {
		const success = await productController.getAllProductES(req);
		return res.render('user/views/dashboard.ejs', {
			page_name: 'user-dashboard',
			page_title: 'Dashboard',
			user: req.user,
			response: success
		})
	} catch (error) {
		return res.status(500).send(error.message);
	}
});

/*** User Sub Module starts ***/

/*
// @Route: Render Create User
*/
namedRouter.get("user.create", '/user/create', (req, res) => {
	userController.create(req).then(success => {
		res.render('user/views/add.ejs', {
			page_name: 'user-management',
			page_title: 'Create User',
			user: req.user,
			response: success
		});
	}, failure => {
		res.status(failure.status).send(failure);
	});
});

/*
// @Route: Create User Action
*/
namedRouter.post("user.store", '/user/store', uploadFile.any(), (req, res) => {
	userController.store(req).then(success => {
		req.flash('success', success.message);
		res.redirect(namedRouter.urlFor('user.list'));
	}, failure => {
		req.flash('error', failure.message);
		res.redirect(namedRouter.urlFor('user.create'));
	});
});


/*
// @Route: Users List
*/

namedRouter.get("user.list", '/user/list', request_param.any(), async (req, res) => {

	try {
		req.userrole = 'user';
		const success = await userController.list(req);

		// For search string //
		let searchStr = {
			'keyword': '',
			'role': ''
		};
		success.search_param = "";

		if (_.isEmpty(req.query) == false && (_.has(req.query, "keyword") || _.has(req.query, "role"))) {
			searchStr = {
				'keyword': req.query.keyword,
				'role': req.query.role
			};
			const serachQryStr = querystring.stringify(searchStr);
			success.search_param = "&" + serachQryStr;
		}

		return res.render('user/views/list.ejs', {
			page_name: 'user-management',
			page_title: 'Users List',
			user: req.user,
			postdata: searchStr,
			response: success,
			// response: {
			// 	data: success.data,
			// 	current: req.query.page || 1,
			// 	pages: success.pageCount,
			// 	search_param: success.search_param
			// },
			userrole: req.userrole
		});
	} catch (error) {
		req.flash('error', error.message);
		res.redirect(namedRouter.urlFor('user.login'));
	}
});

/*
// @Route: Render Edit User
*/
namedRouter.get("user.edit", '/user/edit/:id', async (req, res) => {
	try {
		req.userrole = 'user';
		const success = await userController.edit(req);

		return res.render('user/views/edit.ejs', {
			page_name: 'user-management',
			page_title: 'Update User',
			user: req.user,
			response: success,
			userrole: req.userrole
		});
	} catch (error) {
		res.status(error.status).send(error);
	}
});

/*
// @Route: Update User Action
*/
namedRouter.post("user.update", '/user/update', uploadFile.any(), async (req, res) => {
	try {
		const success = await userController.update(req);

		req.flash('success', success.message);
		return res.redirect(namedRouter.urlFor('user.list'));
	} catch (error) {
		const userId = req.body.user_id;
		req.flash('error', error.message);
		return res.redirect(namedRouter.urlFor('user.edit', {
			id: userId
		}));
	}
});

/*
// @Route: Render Details User
*/
namedRouter.get("user.view", '/user/view/:id', async (req, res) => {
	try {
		req.userrole = 'user';
		const success = await userController.edit(req);

		return res.render('user/views/viewdetails.ejs', {
			page_name: 'user-management',
			page_title: 'View User Details',
			user: req.user,
			response: success,
			userrole: req.userrole
		});
	} catch (error) {
		res.status(error.status).send(error);
	}
});

/*
// @Route: User status change
*/
namedRouter.post('user.status.change', '/user/status-change', request_param.any(), async (req, res) => {
	try {
		const success = await userController.statusChange(req);
		req.flash('success', success.message);
		return res.send(success);
	} catch (error) {
		req.flash('error', error.message);
		return res.redirect(namedRouter.urlFor('user.list'));
	}
});

/*
// @Route: Delete User
*/
namedRouter.get('user.delete', '/user/delete/:id', request_param.any(), async (req, res) => {
	try {
		const success = await userController.destroy(req);
		req.flash('success', success.message);
		return res.redirect(namedRouter.urlFor('user.list'));
	} catch (error) {
		req.flash('error', error.message);
		return res.redirect(namedRouter.urlFor('user.list'));
	}
});

/*** User Sub Module ends ***/


/* My Profile [Admin] Section View starts */
namedRouter.get("user.myprofile", '/user/myprofile/:id', async (req, res) => {
	try {
		const success = await userController.viewmyprofile(req);

		return res.render('user/views/myprofile.ejs', {
			page_name: 'user-profile',
			page_title: 'Edit My Profile',
			user: req.user,
			response: success
		});
	} catch (error) {
		res.status(error.status).send(error);
	}
});

/* My Profile [Admin] Update starts */
namedRouter.post("user.profileupdate", '/user/profileupdate', request_param.any(), async (req, res) => {

	try {
		const success = await userController.updateprofile(req);

		req.flash('success', success.message);
		return res.redirect(namedRouter.urlFor('user.dashboard', {
			id: success.data
		}));
	} catch (error) {
		req.flash('error', error.message);
		return res.redirect(namedRouter.urlFor('user.login'));
	}
});

/* Chnagepassword [Admin] View starts */
namedRouter.get("user.changepassword", '/user/change-password', async (req, res) => {
	try {
		return res.render('user/views/change_password.ejs', {
			page_name: 'user-changepassword',
			page_title: 'Change Password',
			user: req.user
		});
	} catch (error) {
		req.flash('error', error.message);
		return res.redirect(namedRouter.urlFor('user.login'));
	}
});

/*
// @Route: Chnage password [Admin] action
*/
namedRouter.post("user.updatepassword", '/user/update-password', request_param.any(), async (req, res) => {
	try {
		const success = await userController.changepassword(req);
		req.flash('success', success.message);
		return res.redirect(namedRouter.urlFor('user.dashboard'));
	} catch (error) {
		req.flash('error', error.message);
		return res.redirect(namedRouter.urlFor('user.changepassword'));
	}
});

namedRouter.get('user.project', '/user/project/:id', request_param.any(), (req, res) => {
	userController.userProject(req).then(success => {
		// For search string //
		const searchStr = {
			'keyword': ''
		};
		success.search_param = "";

		if (_.isEmpty(req.query) == false && (_.has(req.query, "keyword"))) {
			searchStr = {
				'keyword': req.query.keyword,
				'role': req.query.role
			};
			const serachQryStr = querystring.stringify(searchStr);
			success.search_param = "&" + serachQryStr;
		}

		res.render('user/views/userProjectList.ejs', {
			page_name: 'user-management',
			page_title: 'Users List',
			user: req.user,
			postdata: searchStr,
			response: success
		});
	}, failure => {
		req.flash('error', failure.message);
		res.redirect(namedRouter.urlFor('user.list'));
	});
});

// Export the express.Router() instance
module.exports = router;