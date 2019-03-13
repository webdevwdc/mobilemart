const settingRepo = require('setting/repositories/setting.repository');
const languageRepo = require('language/repositories/language.repository');
const slug = require('slug');
/*
// @Method: create
// @Description:  render add setting page
*/
exports.create = async req => {
    try {
        // const data = await settingRepo.getById(req.params.id);
        const languages = await languageRepo.getAllLanguage();
        return { "status": 200, languages, "message": "Setting Fetched Successfully" };
    } catch (error) {
        throw error;
    }
};

/*
// @Method: store
// @Description:  render add setting page
*/
exports.store = async req => {
    try {
        req.body.slug = slug(req.body.setting_name, { replacement: '_', lower: true });
        const existingData = await settingRepo.getByField({ slug: req.body.slug });
        let data;
        if (_.isNull(existingData))
            data = await settingRepo.save(req.body);
        else
            throw new Error('This Setting is already exist!')

        return { "status": 200, data, "message": "Setting Fetched Successfully" };
    } catch (error) {
        throw error;
    }
};

/*
// @Method: edit
// @Description:  render cms update page
*/
exports.edit = async req => {
    try {
        const data = await settingRepo.getById(req.params.id);
        const languages = await languageRepo.getAllLanguage();
        return { "status": 200, data, languages, "message": "Setting Fetched Successfully" };
    } catch (error) {
        throw error;
    }
};


/* 
// @Method: update
// @Description: Cms update action
*/
exports.update = async req => {
    try {
        const result = await settingRepo.getByField({ 'setting_name': req.body.setting_name, '_id': { $ne: req.body.setting_id } });
        if (_.isEmpty(result)) {
            const result2 = await settingRepo.updateById(req.body, req.body.setting_id);
            return { "status": 200, data: result2, "message": "Setting Updated Successfully" };
        } else {
            throw new Error('This Setting is already exist!');
        }
    } catch (error) {
        throw error;
    }
};


/* 
// @Method: list
// @Description: To get all the cmss from DB
*/
exports.list = async req => {
    try {
        return await settingRepo.getAll(req.query, { '_id': -1 }, (req.query.page || 1));
    } catch (error) {
        throw error;
    }
};

/*
// @Method: statusChange
// @Description: Cms status change action
*/
exports.statusChange = async req => {
    try {
        const result = await settingRepo.getById(req.body.id);
        const updatedStatus = (_.has(result, 'status') && result.status == "Inactive") ? "Active" : "Inactive";
        const result2 = await settingRepo.updateById({ 'status': updatedStatus }, req.body.id);
        return { "status": 200, data: result2, "message": "Setting status has changed successfully" }
    } catch (error) {
        throw error;
    }
};

/* 
// @Method: delete
// @Description: Cms delete
*/
exports.destroy = async req => {
    try {
        const result = await settingRepo.delete(req.params.id);
        return { "status": 200, data: result, "message": "Setting Removed Successfully" };
    } catch (error) {
        throw error;
    }
};
