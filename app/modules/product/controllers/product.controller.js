const ProductRepo = require('product/repositories/product.repository');
const csv = require('csvtojson');

/* Copied from repo to work with ES */
const elasticsearch = require('elasticsearch');
const esIndexName = 'mobilemart';
const elasticClient = new elasticsearch.Client({
    host: `${process.env.ELASTICSEARCH_DB_HOST}`,
    log: process.env.ELASTICSEARCH_DB_SHOULD_TRACE,
    requestTimeout: 60000
});


/* @Method: Create
// @Description: Fare suggestion create Render
*/
exports.store = async req => {
    try {
        const result = await ProductRepo.save(req.body);
        return {
            "status": 200,
            data: result,
            "message": 'Data stored successfully'
        };
    } catch (error) {
        throw error;
    }
};

/*
// @Method: edit
// @Description: render fare-suggestion update page
*/
exports.edit = async req => {
    try {
        const data = await ProductRepo.getById(req.params.id);
        return {
            "status": 200,
            data,
            "message": "Data Fetched Successfully"
        };
    } catch (error) {
        throw error;
    }
};

/* 
// @Method: update
// @Description: Fare Suggestion update action
*/
exports.update = async req => {
    try {
        const updatedId = req.body.product_id;
        delete req.body.product_id;
        const result2 = await ProductRepo.updateById(req.body, req.body.product_id);
        return {
            "status": 200,
            data: result2,
            "message": "Data Updated Successfully"
        };
    } catch (error) {
        throw error;
    }
};

/* 
// @Method: list
// @Description: To get all the Fare Suggestions from DB
*/
exports.list = async req => {
    try {
        // return await ProductRepo.getAll(req.query, { _id: -1 }, (req.query.page || 1));
        const currentPage = req.query.page || 1;
        const {
            data,
            pageCount,
            totalCount
        } = await ProductRepo.getAll(req.query, {
            '_id': -1
        }, currentPage);


        return {
            "status": 200,
            data,
            current: currentPage,
            pages: pageCount,
            "message": "Data Fetched Successfully"
        };
    } catch (error) {
        throw error;
    }
};

/*
// @Method: statusChange
// @Description: Fare Suggestion status change action
*/
exports.statusChange = async req => {
    try {
        const result = await ProductRepo.getById(req.body.id);
        const result2 = await ProductRepo.updateById({
            'status': (_.has(result, 'status') && result.status === "Inactive") ? "Active" : "Inactive"
        }, req.body.id);
        return {
            "status": 200,
            data: result2,
            "message": "Data status has changed successfully"
        }
    } catch (error) {
        throw error;
    }
};

/* 
// @Method: delete
// @Description: Fare Suggestion delete
*/
exports.destroy = async req => {
    try {
        const result = await ProductRepo.delete(req.params.id);
        return {
            "status": 200,
            data: result,
            "message": "Data Removed Successfully"
        };
    } catch (error) {
        throw error;
    }
};

exports.getallforCSV = async req => {
    try {
        const result = await ProductRepo.getAllProduct();
        return {
            "status": 200,
            data: result,
            "message": "All Data Fetched Successfully"
        };
    } catch (error) {
        throw error;
    }
};

exports.importProductCSV = async req => {
    try {
        await csv()
            .fromFile(req.files[0].path)
            .then((jsonObj) => {
                // console.log(jsonObj.length);
                jsonObj.forEach(async element => {
                    // console.log(element);
                    await ProductRepo.updateByField({
                        product_id: Number(element.product_id),
                        variant_id: Number(element.variant_id) == 0 || element.variant_id == '' ? null : Number(element.variant_id)
                    }, {
                            comp1_product_link: element.comp1_product_link,
                            comp2_product_link: element.comp2_product_link,
                            comp3_product_link: element.comp3_product_link,
                            comp4_product_link: element.comp4_product_link
                        });
                });
            })
        return {
            "status": 200,
            data: [],
            "message": "Data Updated Successfully"
        };
    } catch (error) {
        throw error;
    }
};

exports.getAllProductES = async req => {
    try {
        req.body.current = req.body.current || 0;
        req.body.length = req.body.length || 10;

        let query;

        if (!_.isEmpty(req.query)) {
            if (req.query.category == 'undefined') {
                query = {
                    "match_all": {}
                };
            } else {
                query = {
                    "match": {
                        "categories.name.keyword": {
                            "query": req.query.category
                        }
                    }
                };
            }
        }

        let products = await ProductRepo.getAllProdutElasticSearch(req.body, query);
        products.hits.hits = products.hits.hits.map((item, index) => {
            item._source['comp1_diff_price'] = item._source['comp1_product_price'] - item._source['sale_price'];
            const comp1_diff_perce = (item._source['comp1_diff_price'] * 100) / item._source['comp1_product_price'];
            item._source['comp1_diff_perce'] = _.isFinite(comp1_diff_perce) ? comp1_diff_perce : 0;


            item._source['comp2_diff_price'] = item._source['comp2_product_price'] - item._source['sale_price'];
            const comp2_diff_perce = (item._source['comp2_diff_price'] * 100) / item._source['comp2_product_price'];
            item._source['comp2_diff_perce'] = _.isFinite(comp2_diff_perce) ? comp2_diff_perce : 0;

            item._source['comp3_diff_price'] = item._source['comp3_product_price'] - item._source['sale_price'];
            const comp3_diff_perce = (item._source['comp3_diff_price'] * 100) / item._source['comp3_product_price'];
            item._source['comp3_diff_perce'] = _.isFinite(comp3_diff_perce) ? comp3_diff_perce : 0;

            item._source['comp4_diff_price'] = item._source['comp4_product_price'] - item._source['sale_price'];
            const comp4_diff_perce = (item._source['comp4_diff_price'] * 100) / item._source['comp4_product_price'];
            item._source['comp4_diff_perce'] = _.isFinite(comp4_diff_perce) ? comp4_diff_perce : 0;

            return item;
        });

        return {
            "status": 200,
            "data": products,
            "message": "Data Fetched Successfully"
        };
    } catch (error) {
        throw new Error(error.message);
    }
};


exports.getAllProductESByNameOrSKU = async req => {
    try {
        req.body.current = req.body.current || 0;
        req.body.length = req.body.length || 10;

        let query = {
            "match_all": {}
        }

        if (req.body.search != '') {
            query = {
                "bool": {
                    "should": [
                        {
                            "match": {
                                "product_name": {
                                    "query": req.body.search
                                }
                            }
                        },
                        {
                            "match": {
                                "product_sku": {
                                    "query": req.body.search
                                }
                            }
                        }
                    ]
                }
            };
        }


        let products = await ProductRepo.getAllProdutElasticSearch(req.body, query);
        products.hits.hits = products.hits.hits.map((item, index) => {
            item._source['comp1_diff_price'] = item._source['comp1_product_price'] - item._source['sale_price'];
            const comp1_diff_perce = (item._source['comp1_diff_price'] * 100) / item._source['comp1_product_price'];
            item._source['comp1_diff_perce'] = _.isFinite(comp1_diff_perce) ? comp1_diff_perce : 0;


            item._source['comp2_diff_price'] = item._source['comp2_product_price'] - item._source['sale_price'];
            const comp2_diff_perce = (item._source['comp2_diff_price'] * 100) / item._source['comp2_product_price'];
            item._source['comp2_diff_perce'] = _.isFinite(comp2_diff_perce) ? comp2_diff_perce : 0;

            item._source['comp3_diff_price'] = item._source['comp3_product_price'] - item._source['sale_price'];
            const comp3_diff_perce = (item._source['comp3_diff_price'] * 100) / item._source['comp3_product_price'];
            item._source['comp3_diff_perce'] = _.isFinite(comp3_diff_perce) ? comp3_diff_perce : 0;

            item._source['comp4_diff_price'] = item._source['comp4_product_price'] - item._source['sale_price'];
            const comp4_diff_perce = (item._source['comp4_diff_price'] * 100) / item._source['comp4_product_price'];
            item._source['comp4_diff_perce'] = _.isFinite(comp4_diff_perce) ? comp4_diff_perce : 0;

            return item;
        });

        return {
            "status": 200,
            "data": products,
            "message": "Data Fetched Successfully"
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.getProdutHistoryElasticSearch = async req => {
    try {
        let products = await ProductRepo.getProdutHistoryElasticSearch(req.body.product_id, req.body.competitor);
        products = products.hits.hits.map(item => {
            item._source.createdAt = _moment(item._source.createdAt).format('DD MMM');
            return item._source;
        });

        const today = new Date();
        const priorDate = new Date().setDate(today.getDate()-30);
        const allDates = utils.getDateArray(priorDate, today);
        let filteredArray = [];
        allDates.map(itemDate => {
            const findData = _.where(products, { 'createdAt': itemDate });
            if(findData.length > 0){
                filteredArray.push(Number(findData[0].price));
            }else{
                filteredArray.push(0);
            }
        })

        return {
            "status": 200,
            "data": filteredArray,
            "message": "Data Fetched Successfully"
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.getRecordFrmHistory = async req => {
    try {
        const products_es = await ProductRepo.exportProdutHistoryByDate(req);

        const copy_result = products_es.hits.hits;
        const product_sku = [];

        copy_result.map(item => {
            if (!product_sku.includes(item._source.product_sku)) {
                product_sku.push(item._source.product_sku);
            }
        })

        const products = product_sku.map(product => {

            let obj = _.filter(copy_result, o => {
                if (o._source.product_sku === product)
                    return o;
            });
            let comp1 = {};
            let comp2 = {};
            let comp3 = {};
            let comp4 = {};

            obj.map(item => {
                if (_moment(item._source.createdAt).format('YYYY-MM-DD') === req.body.startdate) {
                    if (item._source.competitor == 'competitor_1') {
                        Object.assign(comp1, { 'product_name': item._source.product_name, 'product_sku': item._source.product_sku, 'competitor_1_start_date_login_price': Number(item._source.price), 'competitor_1_start_date_retail_price': Number(item._source.price_retail) });
                    } else if (item._source.competitor == 'competitor_2') {
                        Object.assign(comp2, { 'product_name': item._source.product_name, 'product_sku': item._source.product_sku, 'competitor_2_start_date_login_price': Number(item._source.price), 'competitor_2_start_date_retail_price': Number(item._source.price_retail) });
                    } else if (item._source.competitor == 'competitor_3') {
                        Object.assign(comp3, { 'product_name': item._source.product_name, 'product_sku': item._source.product_sku, 'competitor_3_start_date_login_price': Number(item._source.price), 'competitor_3_start_date_retail_price': Number(item._source.price_retail) });
                    } else {
                        Object.assign(comp4, { 'product_name': item._source.product_name, 'product_sku': item._source.product_sku, 'competitor_4_start_date_login_price': Number(item._source.price), 'competitor_4_start_date_retail_price': Number(item._source.price_retail) });
                    }
                } else {
                    if (item._source.competitor == 'competitor_1') {
                        Object.assign(comp1, { 'product_name': item._source.product_name, 'product_sku': item._source.product_sku, 'competitor_1_end_date_login_price': Number(item._source.price), 'competitor_1_end_date_retail_price': Number(item._source.price_retail) });
                    } else if (item._source.competitor == 'competitor_2') {
                        Object.assign(comp2, { 'product_name': item._source.product_name, 'product_sku': item._source.product_sku, 'competitor_2_end_date_login_price': Number(item._source.price), 'competitor_2_end_date_retail_price': Number(item._source.price_retail) });
                    } else if (item._source.competitor == 'competitor_3') {
                        Object.assign(comp3, { 'product_name': item._source.product_name, 'product_sku': item._source.product_sku, 'competitor_3_end_date_login_price': Number(item._source.price), 'competitor_3_end_date_retail_price': Number(item._source.price_retail) });
                    } else {
                        Object.assign(comp4, { 'product_name': item._source.product_name, 'product_sku': item._source.product_sku, 'competitor_4_end_date_login_price': Number(item._source.price), 'competitor_4_end_date_retail_price': Number(item._source.price_retail) });
                    }
                }
            })

            return { ...comp1, ...comp2, ...comp3, ...comp4 };
        });



        return {
            "status": 200,
            "data": products,
            "message": "Data Fetched Successfully"
        };
    } catch (error) {
        throw new Error(error.message);
    }
};
