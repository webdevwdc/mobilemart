const Q = require('q');
const template_Repo = require('template/repositories/template.repository');
const languageRepo = require('language/repositories/language.repository');
const userRepo = require('user/repositories/user.repository');
const _ = require("underscore");
const perPage = config.PAGINATION_PERPAGE;
nodemailer = require("nodemailer");
const slug = require('slug');

/* @Method: list
// @Description: To get all the template from DB
*/
exports.list = async req => {
    try {
        const currentPage = req.query.page || 1
        const sortOrder = {
            '_id': -1
        };

        const allLanguage = await languageRepo.getAllLanguage();
        const getAll = await template_Repo.getAll(req.query, sortOrder, currentPage);
        return {
            "languages": allLanguage,
            "status": 200,
            data: getAll.data,
            current: currentPage,
            pages: Math.ceil(getAll.data.total_pages / config.PAGINATION_PERPAGE),
            "message": "Template Fetched Successfully"
        };

    } catch (error) {
        return {
            "status": 500,
            data: [],
            "message": error
        };
    }
};


/* @Method: create
// @Description: render template create page
*/

exports.create = async (req, res) => {
    try {
        const result = await languageRepo.getAllLanguage();
        // console.log("controller", result)

        return {
            "status": 200,
            data: [],
            languages: result,
            "message": "Template Fetched Successfully"
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
// @Description: template create action
*/
exports.store = async req => {
    console.log('controller', req.body);
    try {
        const templateByField = await template_Repo.getByField({
            title: req.body.title
        });
        console.log('after')

        if (_.isEmpty(templateByField)) {
            req.body.slug = slug(req.body.title, {
                lower: true,
                replacement: '-',
                symbols: true
            });
            console.log('req.body', req.body);
            const result = await template_Repo.save(req.body);

            return ({
                "status": 200,
                data: result,
                "message": "Template created successfully"
            });

        } else {
            return new Error({
                "status": 500,
                data: [],
                "message": 'Template already exists. Please try another.'
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

/*
// @Method: edit
// @Description:  render template update page
*/
exports.edit = async req => {
    try {
        const language = await languageRepo.getAllLanguage();
        const result = await template_Repo.getById(req.params.id);
        return ({
            "status": 200,
            data: result,
            languages: language,
            "message": "Template Fetched Successfully"
        });

    } catch (error) {
        return {
            "status": 500,
            data: [],
            "message": error
        };
    }
};

/* @Method: update
// @Description:template update action
*/
exports.update = async req => {
    try {
        const result1 = await template_Repo.getByField({
            title: req.body.title,
            _id: {
                $ne: req.body.template_id
            }
        })
        if (_.isEmpty(result1)) {
            const result = await template_Repo.updateById(req.body, req.body.template_id);

            return ({
                "status": 200,
                data: result,
                "message": "Template Updated Successfully"
            });

        } else {
            return new Error({
                "status": 500,
                data: [],
                "message": 'Template already exists. Please try another.'
            });
        }

    } catch (error) {
        return {
            "status": 500,
            data: [],
            "message": error
        };

    };
}
/* @Method: Delete
// @Description: Template Delete action
*/
exports.delete = async req => {
    try {
        const result = template_Repo.updateById({
            is_deleted: true
        }, req.params.id)
        if (err) {
            return new Error({
                "status": 500,
                data: [],
                "message": err
            });
        } else {
            return ({
                "status": 200,
                data: result,
                "message": "Template Deleted Successfully"
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
/*
// @Method: status_change
// @Description: template status change action
*/
exports.status_change = async req => {
    try {
        const result1 = template_Repo.getById(req.body.id)
        if (err)
            return new Error({
                "status": 500,
                data: [],
                "message": err
            });
        serviceStatus = (result1.status == 'Active') ? 'Inactive' : 'Active';
        const result2 = template_Repo.updateById({
            'status': serviceStatus
        }, req.body.id);
        return ({
            "status": 200,
            data: result2,
            "message": "Template status has changed successfully"
        });

    } catch (error) {
        return {
            "status": 500,
            data: [],
            "message": error
        };
    }
};

/*
// @Method: send_email
// @Description: Send Email action
*/
exports.send_email = async req => {
    try {
        const allTemplates = template_Repo.getAllTemplate();
        if (err)
            return new Error({
                "status": 500,
                data: [],
                "message": err
            });

        const allusers = userRepo.getAllUsers(req.user);

        if (err)
            deferred.reject({
                "status": 500,
                data: [],
                "message": err2
            });

        deferred.resolve({
            "status": 200,
            data: {
                templates: allTemplates,
                users: allusers,
            },
            "message": "All data fetched successfully"
        });


    } catch (error) {
        return {
            "status": 500,
            data: [],
            "message": error
        };
    }
};