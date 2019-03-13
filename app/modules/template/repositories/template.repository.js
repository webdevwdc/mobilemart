const tempalate = require('template/models/template.model');
const perPage = config.PAGINATION_PERPAGE;

class TempalateRepository {
    constructor() {}

    async getAll(searchQuery, sortOrder = {
        '_id': -1
    }, page) {
        try {
            const query = [{
                "is_deleted": false
            }];
            // serach by keyword
            if (_.has(searchQuery, "keyword")) {
                if (searchQuery.keyword != '') {
                    const search = searchQuery.keyword.trim();
                    query.push({
                        "$or": [{
                            'title': {
                                '$regex': search,
                                '$options': 'i'
                            }
                        }]
                    });
                }
            }
            searchQuery = {
                "$and": query
            };
            // console.log('hello', searchQuery)
            const aggregate = tempalate.aggregate([{
                    "$sort": sortOrder
                },
                {
                    $project: {
                        _id: "$_id",
                        language: "$language",
                        title: "$title",
                        content: "$content",
                        slug: "$slug",
                        translate: '$translate',
                        status: "$status",
                        is_deleted: "$is_deleted",
                        created_at: "$created_at"
                    }
                },
                {
                    $match: searchQuery
                },
            ]);
            return await tempalate.aggregatePaginate(aggregate, {
                page: page,
                limit: perPage
            }); // { data, pageCount, totalCount }
        } catch (error) {
            return error;
        }
    }

    async getAllTemplate(cb) {
        try {
            return await tempalate.find({
                is_deleted: false
            }).lean().exec();
        } catch (error) {
            return error;
        }
    }

    async getById(id) {
        try {
            return await tempalate.findById(id).lean().exec();
        } catch (error) {
            return error;
        }
    }

    async getByField(params) {
        // console.log('repository', params)
        // console.log('hello repository')
        try {
            const _params = Object.assign(params, {
                "isDeleted": false,
            })
            return await tempalate.findOne(_params).lean().exec();
        } catch (error) {
            return error;
        }
    }


    async getAllByField(params) {
        try {
            const _params = Object.assign(params, {
                "isDeleted": false,
            });
            return await tempalate.find(_params).lean().exec();
        } catch (error) {
            return error;
        }
    }

    async getCount(params) {
        try {
            return await tempalate.count(params).lean().exec();
        } catch (error) {
            return error;
        }
    }


    async updateById(data, id) {
        try {
            return await tempalate.findByIdAndUpdate(id, data).lean().exec();
        } catch (error) {
            return error;
        }
    }

    async updateByField(field, fieldValue, data) {
        //todo: update by field
    }

    async save(obj) {
        try {
            const new_Template = new tempalate(obj);
            return await new_Template.save();
        } catch (error) {
            return error;
        }
    }
};

module.exports = new TempalateRepository();