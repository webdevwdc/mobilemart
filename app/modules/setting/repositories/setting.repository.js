const Setting = require('setting/models/setting.model');
const perPage = config.PAGINATION_PERPAGE;

class SettingRepository {
    constructor() {}

    async getAll(searchQuery, sortOrder = {
        _id: -1
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
                                'setting_name': {
                                    '$regex': search,
                                    '$options': 'i'
                                }
                            },
                            {
                                'setting_value': {
                                    '$regex': search,
                                    '$options': 'i'
                                }
                            }
                        ]
                    });
                }
            }
            searchQuery = {
                "$and": query
            };
            const aggregate = Setting.aggregate([{
                    "$sort": sortOrder
                },
                {
                    $project: {
                        _id: "$_id",
                        setting_name: "$setting_name",
                        setting_value: "$setting_value",
                        status: "$status",
                        slug: "$slug"
                    }
                },
                {
                    $match: searchQuery
                },
            ]);
            return await Setting.aggregatePaginate(aggregate, {
                page: page,
                limit: perPage
            }); // { data, pageCount, totalCount }
        } catch (error) {
            return error;
        }
    }

    async getById(id) {
        try {
            return await Setting.findById(id).lean().exec();
        } catch (error) {
            return error;
        }
    }

    async getByField(params) {
        try {
            return await Setting.findOne(params).lean().exec();
        } catch (error) {
            return error;
        }
    }

    async getAllByField(params) {
        try {
            return await Setting.find(params).lean().exec();
        } catch (error) {
            return error;
        }
    }

    async delete(id) {
        try {
            await Setting.findById(id).lean().exec();
            return await Setting.deleteOne({
                _id: id
            }).lean().exec();
        } catch (error) {
            return error;
        }
    }

    async updateById(data, id) {
        try {
            return await Setting.findByIdAndUpdate(id, data, {
                    new: true,
                    upsert: true
                })
                .lean().exec();
        } catch (error) {
            return error;
        }
    }

    async getSettingCount() {
        try {
            return await Setting.count({
                'status': "Active"
            });
        } catch (error) {
            return error;
        }
    }

    async save(data) {
        try {
            return await Setting.create(data).lean().exec();
        } catch (error) {
            return error;
        }
    }
}

module.exports = new SettingRepository();