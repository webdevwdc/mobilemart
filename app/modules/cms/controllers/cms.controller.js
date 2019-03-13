const cmsRepo = require('cms/repositories/cms.repository');
const languageRepo = require('language/repositories/language.repository');

/*
// @Method: edit
// @Description:  render cms update page
*/
exports.edit = async req => {
    try {
        const data = await cmsRepo.getById(req.params.id);
        const languages = await languageRepo.getAllLanguage();
        return {
            "status": 200,
            data,
            languages,
            "message": "Cms Fetched Successfully"
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
// @Method: update
// @Description: Cms update action
*/
exports.update = async req => {
    try {
        const result = await cmsRepo.getByField({
            'title': req.body.title,
            '_id': {
                $ne: req.body.cms_id
            }
        });
        if (_.isEmpty(result)) {
            const result2 = await cmsRepo.updateById(req.body, req.body.cms_id);
            return {
                "status": 200,
                data: result2,
                "message": "Cms Updated Successfully"
            };
        } else {
            return new Error({
                "status": 500,
                data: [],
                "message": "This title is already exist!"
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
// @Method: list
// @Description: To get all the cmss from DB
*/
exports.list = async req => {
    try {
        return await cmsRepo.getAll(req.query, {
            'cms.title': 1
        }, (req.query.page || 1));
    } catch (error) {
        return {
            "status": 500,
            data: [],
            "message": error
        };
    }
};

/*
// @Method: statusChange
// @Description: Cms status change action
*/
exports.statusChange = async req => {
    try {
        const result = await cmsRepo.getById(req.body.id);
        const updatedStatus = (_.has(result, 'status') && result.status == "Inactive") ? "Active" : "Inactive";
        const result2 = await cmsRepo.updateById({
            'status': updatedStatus
        }, req.body.id);
        return {
            "status": 200,
            data: result2,
            "message": "Cms status has changed successfully"
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
// @Method: delete
// @Description: Cms delete
*/
exports.destroy = async req => {
    try {
        const result = await cmsRepo.delete(req.params.id);
        return {
            "status": 200,
            data: result,
            "message": "Cms Removed Successfully"
        };
    } catch (error) {
        return {
            "status": 500,
            data: [],
            "message": error
        };
    }
};