const Language = require('language/models/language.model');
const perPage = config.PAGINATION_PERPAGE;

class LanguageRepository {
    constructor() { }

    async getAllLanguage() {
        try {
            return await Language.find({ isDeleted: false, status: 'Active' }).lean().exec();
        } catch (error) {
            return error;
        }
    }

    async getAll(searchQuery, sortOrder, page) {
        try {
            const match = [{ is_deleted: false }];

            if (_.has(searchQuery, "keyword")) {
                if (searchQuery.keyword != '') {
                    const search_string = searchQuery.keyword.trim();
                    match.push({
                        "$or": [{ 'category_title': { '$regex': search_string, '$options': 'i' } }
                        ]
                    });
                }
            }
            return await Language.find({ '$and': match }).sort(sortOrder).paginate(page, perPage);
        } catch (error) {
            return error;
        }
    }

    async getById(id) {
        try {
            return await Language.findById(id).exec();
        } catch (error) {
            return error;
        }
    }

    getById(id, cb) {
        Language.findById(id, function (err, result) {
            if (err) {
                return cb(err, null);
            } else {
                return cb(null, result);
            }

        });
    }

    async getByField(params) {
        try {
            return await Language.findOne(params).exec();
        } catch (error) {
            return error;
        }
    }

    async getAllByField(params) {
        try {
            return await Language.find(params).exec();
        } catch (error) {
            return error;
        }
    }

    async getCount(params) {
        try {
            return await Language.count(params);
        } catch (error) {
            return error;
        }
    }

    async updateById(data, id) {
        try {
            return await Language.findByIdAndUpdate(id, data, { new: true, upsert: true }).exec();
        } catch (error) {
            return error;
        }
    }

    async save(data) {
        try {
            return await Language.create(data).exec();
        } catch (error) {
            return error;
        }
    }
}

module.exports = new LanguageRepository();