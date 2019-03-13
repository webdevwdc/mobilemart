const cmsRepo = require('cms/repositories/cms.repository');

exports.getCMSBySlug = async req => {
    try{
        const cms = await cmsRepo.getByField({slug: req.params.slug, status: 'Active'});
        return { status: 200, data: cms, message: 'CMS fetched Successfully' };
    } catch (error) {
        return { "success": false, "status": 500, data: [], "message": 'Something went wrong' }
    }
};