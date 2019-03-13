const mongoose = require('mongoose');
const Product = require('product/models/product.model');
const perPage = config.PAGINATION_PERPAGE;


const elasticsearch = require('elasticsearch');
const esIndexName = 'mobilemart';
const elasticClient = new elasticsearch.Client({
    host: `${process.env.ELASTICSEARCH_DB_HOST}`,
    log: process.env.ELASTICSEARCH_DB_SHOULD_TRACE,
    requestTimeout: 60000
});

class ProductRepository {
    constructor() { }

    async getAll(_searchQuery, sortOrder, page) {
        try {
            const query = [{ "isDeleted": false }]
            // serach by keyword
            if (_.has(_searchQuery, "keyword")) {
                if (_searchQuery.keyword != '') {
                    const search = _searchQuery.keyword.trim();
                    query.push({
                        "$or": [{
                            'product_name': {
                                '$regex': search,
                                '$options': 'i'
                            }
                        },
                        {
                            'product_sku': {
                                '$regex': search,
                                '$options': 'i'
                            }
                        },
                        {
                            'product_id': {
                                '$regex': search,
                                '$options': 'i'
                            }
                        },
                        {
                            'variant_id': {
                                '$regex': search,
                                '$options': 'i'
                            }
                        },
                        {
                            'variant_sku': {
                                '$regex': search,
                                '$options': 'i'
                            }
                        }]
                    });
                }
            }

            const searchQuery = {
                "$and": query
            };


            const aggregate = Product.aggregate([
                {
                    $sort: sortOrder
                },
                {
                    $match: searchQuery
                }]);
            return await Product.aggregatePaginate(aggregate, {
                page: page,
                limit: perPage
            });

        } catch (error) {
            throw error;
        }
    }

    async getAllProduct() {
        try {
            return await Product.find({}).lean().exec();
        } catch (error) {
            throw error;
        }
    }

    async getById(id) {
        try {
            return await Product.findById(id).lean().exec();
        } catch (error) {
            throw error;
        }
    }

    async getByField(params) {
        try {
            return await Product.findOne(params).exec();
        } catch (error) {
            throw error;
        }
    }

    async getAllByField(params) {
        try {
            return await Product.find(params).exec();
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            return await Product.findByIdAndUpdate(id, {
                isDeleted: true
            }).exec();
        } catch (error) {
            throw error;
        }
    }

    async updateById(data, id) {
        try {
            return Product.findByIdAndUpdate(id, data, {
                new: true
            }).exec();
        } catch (error) {
            throw error;
        }
    }

    async updateByField(field, data) {
        try {
            return await Product.findOneAndUpdate(field, data, {
                new: true
            }).exec();
        } catch (error) {
            throw error;
        }
    }

    async save(data) {
        try {
            const _save = new Product(data);
            return await _save.save();
        } catch (error) {
            throw error;
        }
    }

    async getByIdElasticSearch(id) {
        try {
            elasticClient.search({
                index: esIndexName,
                body: {
                    "query": {
                        "match": {
                            "_id": {
                                "query": id,
                            }
                        }
                    }
                }
            }, async function (err, resp) {
                if (err) {
                    throw err;
                } else {
                    return await Object.assign(resp.hits.hits[0]._source, {
                        _id: resp.hits.hits[0]['_id']
                    });
                }
            });

        } catch (error) {
            throw error;
        }
    }

    async getAllProdutElasticSearch(params, query) {
        try {
            return elasticClient.search({
                index: esIndexName,
                body: {
                   "from": params.current, "size": params.length,
                    "query": query,
                    "sort": [
                        { "updatedAt": { "order": "desc" } }
                    ],
                }
            });
        } catch (error) {
            throw new Error(error.message);;
        }
    }

    async getProdutHistoryElasticSearch(product_id, competitor) {
        try {
            return elasticClient.search({
                index: 'mobilemart_history',
                body: {
                    "query": {
                        "bool": {
                            "must": [
                                { "match": { "product_id.keyword": product_id } },
                                { "match": { "competitor.keyword": "competitor_" + competitor } }
                            ]
                        }
                    }
                }
            });
        } catch (error) {
            throw new Error(error.message);;
        }
    }

    async getByFieldElasticSearch(field, value) {
        try {
            elasticClient.search({
                index: esIndexName,
                body: {
                    "query": {
                        "match": {
                            [field]: {
                                "query": value,
                            }
                        }
                    }
                }
            }, async function (err, resp) {
                if (err) {
                    throw err;
                } else {
                    return await resp.hits.hits;
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async updateElasticSearch(id, params) {
        try {
            elasticClient.update({
                index: esIndexName,
                type: esIndexName,
                id,
                body: {
                    doc: params.payLoad
                },
            }, async function (err, _) {
                if (err) {
                    throw err;
                } else {
                    return await _;
                }
            })
        } catch (error) {
            throw error;
        }
    }

    async exportProdutHistoryByDate(req) {
        let startdates = `${req.body.startdate} 00:00:00`; 
        let startdatee = `${req.body.startdate} 23:59:59`;
        let enddates = `${req.body.enddate} 00:00:00`; 
        let enddatee = `${req.body.enddate} 23:59:59`;  
        try {          
            return elasticClient.search({
                index: 'mobilemart_history',
                body: {
                    "from" : 0, 
                    "size" : 10000,
                    "query": {
                        "bool": {
                            "should" : [
                                {
                                    "range": {
                                        "createdAt": {
                                            "gte": startdates,
                                            "lte": startdatee,
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                },
                                {
                                    "range": {
                                        "createdAt": {
                                            "gte": enddates,
                                            "lte": enddatee,
                                            "format": "yyyy-MM-dd HH:mm:ss"
                                        }
                                    }
                                }
                            ]
                        }                            
                    }
                }
            });
        } catch (error) {
            throw new Error(error.message);;
        }
    }
}

module.exports = new ProductRepository();