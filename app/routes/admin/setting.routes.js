const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require('querystring');


const multer = require('multer');
const settingController = require('setting/controllers/setting.controller');

const request_param = multer();

namedRouter.all('/setting*', auth.authenticate);

/*
// @Route: setting List
*/
namedRouter.get("setting.list", '/setting/list', request_param.any(), async (req, res) => {
	try {
		const success = await settingController.list(req);
		let searchStr = { 'keyword': '', 'role': '' };
		success.search_param = "";
		if (_.isEmpty(req.query) == false && (_.has(req.query, "keyword") || _.has(req.query, "role"))) {
			searchStr = { 'keyword': req.query.keyword, 'role': req.query.role };
			success.search_param = "&" + querystring.stringify(searchStr);
		}
		// For search string
		return res.render('setting/views/list.ejs', {
			page_name: 'setting-management',
			page_title: 'Setting List',
			user: req.user,
			postdata: searchStr,
			response: success
		});
	} catch (error) {
		req.flash('error', error.message);
		return res.redirect(namedRouter.urlFor('setting.list'));
	}
});

/*
// @Route: Render Create setting
*/
namedRouter.get("setting.create", '/setting/create', async (req, res) => {
	try {
		const success = await settingController.create(req);
		return res.render('setting/views/add.ejs', {
			page_name: 'setting-management',
			page_title: 'Create Setting',
			user: req.user,
			response: success
		});
	} catch (error) {
		return res.redirect(namedRouter.urlFor('setting.list'));
	}
});

/*
// @Route: Create setting Action
*/
namedRouter.post("setting.store", '/setting/store', request_param.any(), async (req, res) => {
	try {
		const success = await settingController.store(req);
		req.flash('success', success.message);
		return res.redirect(namedRouter.urlFor('setting.list'));
	} catch (failure) {
		req.flash('error', failure.message);
		return res.redirect(namedRouter.urlFor('setting.create'));
	}
});

/*
// @Route: Render Edit setting
*/
namedRouter.get("setting.edit", '/setting/edit/:id', async (req, res) => {
	try {
		const success = await settingController.edit(req);
		return res.render('setting/views/edit.ejs', {
			page_name: 'setting-management',
			page_title: 'Update Setting',
			user: req.user,
			response: success
		});
	} catch (error) {
		return res.status(failure.status).send(failure);
	}
});

/*
// @Route: Update setting Action
*/
namedRouter.post("setting.update", '/setting/update', request_param.any(), async (req, res) => {
	const settingId = req.body.setting_id;
	try {
		const success = await settingController.update(req);
		req.flash('success', success.message);
		return res.redirect(namedRouter.urlFor('setting.list'));
	} catch (failure) {
		req.flash('error', failure.message);
		return res.redirect(namedRouter.urlFor('setting.edit', { id: settingId }));
	}
});

/*
// @Route: setting status change
*/
namedRouter.post('setting.status.change', '/setting/status-change', request_param.any(), async (req, res) => {
	try {
		const success = await settingController.statusChange(req);
		req.flash('success', success.message);
		return res.send(success);
	} catch (error) {
		req.flash('error', failure.message);
		return res.redirect(namedRouter.urlFor('setting.list'));
	}
});

/*
// @Route: Delete setting
*/
namedRouter.get('setting.delete', '/setting/delete/:id', request_param.any(), async (req, res) => {
	try {
		const success = await settingController.destroy(req);
		req.flash('success', success.message);
		return res.redirect(namedRouter.urlFor('setting.list'));
	} catch (error) {
		req.flash('error', failure.message);
		return res.redirect(namedRouter.urlFor('setting.list'));
	}
});

// Export the express.Router() instance
module.exports = router;
