const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require('querystring');


const multer = require('multer');
const cmsController = require('cms/controllers/cms.controller');

const request_param = multer();

namedRouter.all('/cms*', auth.authenticate);

/*
// @Route: CMS List
*/
namedRouter.get("cms.list", '/cms/list', request_param.any(), async (req, res) => {
	try {
		const success = await cmsController.list(req);
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
			success.search_param = "&" + querystring.stringify(searchStr);
		}
		// For search string
		return res.render('cms/views/list.ejs', {
			page_name: 'cms-management',
			page_title: 'CMS List',
			user: req.user,
			postdata: searchStr,
			response: success
		});
	} catch (error) {
		req.flash('error', error.message);
		return res.redirect(namedRouter.urlFor('cms.list'));
	}
});

/*
// @Route: Render Create CMS
*/
namedRouter.get("cms.create", '/cms/create', async (req, res) => {
	try {
		const success = await cmsController.create(req);
		return res.render('cms/views/add.ejs', {
			page_name: 'cms-management',
			page_title: 'Create CMS',
			user: req.user,
			response: success
		});
	} catch (error) {
		return res.redirect(namedRouter.urlFor('cms.list'));
	}
});

/*
// @Route: Create CMS Action
*/
namedRouter.post("cms.store", '/cms/store', request_param.any(), async (req, res) => {
	try {
		const success = await cmsController.store(req);
		req.flash('success', success.message);
		return res.redirect(namedRouter.urlFor('cms.list'));
	} catch (error) {
		req.flash('error', failure.message);
		return res.redirect(namedRouter.urlFor('cms.create', {
			id: req.body.paired_user
		}));
	}
});

/*
// @Route: Render Edit CMS
*/
namedRouter.get("cms.edit", '/cms/edit/:id', async (req, res) => {
	try {
		const success = await cmsController.edit(req);
		return res.render('cms/views/edit.ejs', {
			page_name: 'cms-management',
			page_title: 'Update CMS',
			user: req.user,
			response: success
		});
	} catch (error) {
		return res.status(failure.status).send(failure);
	}
});

/*
// @Route: Update CMS Action
*/
namedRouter.post("cms.update", '/cms/update', request_param.any(), async (req, res) => {
	const cmsId = req.body.cms_id;
	try {
		const success = await cmsController.update(req);
		req.flash('success', success.message);
		return res.redirect(namedRouter.urlFor('cms.list'));
	} catch (error) {
		req.flash('error', failure.message);
		return res.redirect(namedRouter.urlFor('cms.edit', {
			id: cmsId
		}));
	}
});

/*
// @Route: CMS status change
*/
namedRouter.post('cms.status.change', '/cms/status-change', request_param.any(), async (req, res) => {
	try {
		const success = await cmsController.statusChange(req);
		req.flash('success', success.message);
		return res.send(success);
	} catch (error) {
		req.flash('error', failure.message);
		return res.redirect(namedRouter.urlFor('cms.list'));
	}
});

/*
// @Route: Delete CMS
*/
namedRouter.get('cms.delete', '/cms/delete/:id', request_param.any(), async (req, res) => {
	try {
		const success = await cmsController.destroy(req);
		req.flash('success', success.message);
		return res.redirect(namedRouter.urlFor('cms.list'));
	} catch (error) {
		req.flash('error', failure.message);
		return res.redirect(namedRouter.urlFor('cms.list'));
	}
});

// Export the express.Router() instance
module.exports = router;