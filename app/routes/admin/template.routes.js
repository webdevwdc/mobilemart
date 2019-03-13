const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require('querystring');
const multer = require('multer');
const template_controller = require('template/controllers/template.controller');

const Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/uploads/template");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});
const request_param = multer();


// Register routing as usual + label

namedRouter.all('/template*', auth.authenticate);

/*
// @Route: Template List
*/
namedRouter.get("template.list", '/template/list', request_param.any(), async (req, res) => {
    try {
        const success = await template_controller.list(req);
        // For search string //
        let searchStr = {
            'keyword': ''
        };
        success.search_param = "";

        if (_.isEmpty(req.query) == false && _.has(req.query, "keyword")) {
            searchStr = {
                'keyword': req.query.keyword
            };
            console.log('88', searchStr)
            success.search_param = "&" + querystring.stringify(searchStr);
            console.log('hh', success.search_param)
        }
        // For search string //
        return res.render('template/views/list.ejs', {
            page_name: 'template-management',
            page_title: 'Template List',
            user: req.user,
            postdata: searchStr,
            response: success
        });
    } catch (error) {
        req.flash('error', error.message);
        return res.redirect(namedRouter.urlFor('template.list'));
    }
});

/*
// @Route: Render Create Template
*/
namedRouter.get("template.create", '/template/create', async (req, res) => {
    try {
        const success = await template_controller.create(req);
        return res.render('template/views/add.ejs', {
            page_name: 'template-management',
            page_title: 'Create Template',
            user: req.user,
            response: success
        });
    } catch (error) {
        return res.redirect(namedRouter.urlFor('template.list'));
    }
});

/*
// @Route: Create Template Action
*/
namedRouter.post("template.store", '/template/store', request_param.any(), async (req, res) => {
    try {
        const success = await template_controller.store(req);
        req.flash('success', success.message);

        return res.redirect(namedRouter.urlFor('template.list'));
    } catch (error) {
        req.flash('error', error.message);
        return res.redirect(namedRouter.urlFor('template.create', {
            id: req.body.paired_user
        }));
    }
});

/*
// @Route: Render Edit Template
*/
namedRouter.get("template.edit", '/template/edit/:id', async (req, res) => {
    try {
        const success = await template_controller.edit(req);
        return res.render('template/views/edit.ejs', {
            page_name: 'template-management',
            page_title: 'Update Template',
            user: req.user,
            response: success
        });
    } catch (error) {
        return res.status(failure.status).send(failure);
    }
});

/*
// @Route: Update Template Action
*/
namedRouter.post("template.update", '/template/update', uploadFile.any(), async (req, res) => {
    const templateId = req.body.template_id;
    try {
        const success = await template_controller.update(req);
        req.flash('success', success.message);
        return res.redirect(namedRouter.urlFor('template.list'));
    } catch (error) {
        req.flash('error', failure.message);
        return res.redirect(namedRouter.urlFor('template.edit', {
            id: templateId
        }));
    }
});
/*
// @Route: Delete Template Action
*/
namedRouter.get("template.delete", '/template/delete/:id', async (req, res) => {
    try {
        const success = await template_controller.delete(req);
        req.flash('success', success.message);
        return res.redirect(namedRouter.urlFor('template.list'));

    } catch (error) {
        req.flash('error', failure.message);
        return res.redirect(namedRouter.urlFor('template.list'));
    }
});
/*
// @Route: Template status change
*/
namedRouter.post('template.status.change', '/template/status-change', request_param.any(), async (req, res) => {
    try {
        const success = await template_controller.status_change(req);
        req.flash('success', success.message);
        return res.send(success)
    } catch (error) {
        req.flash('error', failure.message);
        return res.redirect(namedRouter.urlFor('template.list'));
    }
});


/*
// @Route: Send Email Action
*/
namedRouter.get("template", '/template/send', async (req, res) => {
    try {
        const success = await template_controller.send_email(req);
        return res.render('template/views/list.ejs', {
            page_name: 'template-management',
            page_title: 'Send email',
            user: req.user,
            response: success
        });
    } catch (error) {
        req.flash('error', failure.message);
        res.redirect(namedRouter.urlFor('template.list'));
    }
});

// Export the express.Router() instance
module.exports = router;