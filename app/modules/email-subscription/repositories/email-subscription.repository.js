const EmailSubscription = require('email-subscription/models/email-subscription.model');
const perPage = config.PAGINATION_PERPAGE;

class EmailSubscriptionRepository {
    constructor() { }

    async getAll(searchQuery, sortOrder = { '_id': 1 }, page) {
        try {
            const query = [{ "isDeleted": false}];
            // serach by keyword
            if (_.has(searchQuery, "keyword")) {
                if (searchQuery.keyword != '') {
                    const search = searchQuery.keyword.trim();
                    query.push({
                        "$or": [
                            { 'name': { '$regex': search, '$options': 'i' } },
                            { 'content': { '$regex': search, '$options': 'i' } }
                        ]
                    });
                }
            }
            searchQuery = { "$and": query };
            const aggregate = EmailSubscription.aggregate([
                { "$sort": sortOrder },
                { $match: searchQuery },
            ]);
            return await EmailSubscription.aggregatePaginate(aggregate, { page: page, limit: perPage }); // { data, pageCount, totalCount }
        } catch (error) {
            return error;
        }
    }

    async getById(id) {
        try {
            return await EmailSubscription.findById(id).lean().exec();
        } catch (error) {
            return error;
        }
    }

    async getByField(params) {
        try {
            const _params = Object.assign(params, {
                "isDeleted": false,
            });
            return await EmailSubscription.findOne(_params).lean().exec();
        } catch (error) {
            return error;
        }
    }

    async getActiveEmails() {
        try {
            return await EmailSubscription.find({
                "status": "Active",
                "isDeleted": false,
            }).lean().exec();
        } catch (error) {
            return error;
        }
    }

    async delete(id) {
        try {
            await EmailSubscription.findById(id).lean().exec();
            return await EmailSubscription.deleteOne({ _id: id }).lean().exec();
        } catch (error) {
            return error;
        }
    }

    async updateById(data, id) {
        try {
            return await EmailSubscription.findByIdAndUpdate(id, data, { new: true, upsert: true })
            .lean().exec();
        } catch (error) {
            return error;
        }
    }

    async save(data) {
        try {
            const _save = new EmailSubscription(data);
            return await _save.save();
        } catch (error) {
            return error;
        }
    }
    
}

module.exports = new EmailSubscriptionRepository();