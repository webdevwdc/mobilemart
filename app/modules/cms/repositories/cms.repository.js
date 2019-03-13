const CMS = require('cms/models/cms.model');
const perPage = config.PAGINATION_PERPAGE;

class CMSRepository {
    constructor() {}

    async getAll(searchQuery, sortOrder = {
        '_id': -1
    }, page) {
        try {
            const query = [{
                "status": "Active"
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
            const aggregate = CMS.aggregate([{
                    "$sort": sortOrder
                },
                {
                    $project: {
                        _id: "$_id",
                        title: "$title",
                        desc: "$desc",
                        status: "$status",
                        slug: "$slug"
                    }
                },
                {
                    $match: searchQuery
                },
            ]);
            return await CMS.aggregatePaginate(aggregate, {
                page: page,
                limit: perPage
            }); // { data, pageCount, totalCount }
        } catch (error) {
            return error;
        }
    }

    async getById(id) {
        try {
            return await CMS.findById(id).lean().exec();
        } catch (error) {
            return error;
        }
    }

    async getByField(params) {
        try {
            return await CMS.findOne(params).lean().exec();
        } catch (error) {
            return error;
        }
    }

    async getAllByField(params) {
        try {
            return await CMS.find(params).lean().exec();
        } catch (error) {
            return error;
        }
    }

    async delete(id) {
        try {
            await CMS.findById(id).lean().exec();
            return await CMS.deleteOne({
                _id: id
            }).lean().exec();
        } catch (error) {
            return error;
        }
    }

    async updateById(data, id) {
        try {
            return await CMS.findByIdAndUpdate(id, data, {
                    new: true,
                    upsert: true
                })
                .lean().exec();
        } catch (error) {
            return error;
        }
    }

    async getCmsCount() {
        try {
            return await CMS.count({
                'status': "Active"
            });
        } catch (error) {
            return error;
        }
    }

    async save(data) {
        try {
            return await CMS.create(data).lean().exec();
        } catch (error) {
            return error;
        }
    }
}

module.exports = new CMSRepository();