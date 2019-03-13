const ProductRepo = require('product/repositories/product.repository');
const cron = require('node-cron');
const WooCommerceAPI = require('woocommerce-api');
const WooCommerce = new WooCommerceAPI({
    url: process.env.WooCommerceUrl,
    consumerKey: process.env.WooCommerceConsumerKey,
    consumerSecret: process.env.WooCommerceConsumerSecret,
    wpAPI: true,
    version: 'wc/v1',
});

/******************* Cron Job ************/
let task;
/******************* Cron Job ************/

exports.getProductsAndActionStart = async (req) => {
    try {
        cron.schedule('1 00 00 * * *', async () => {

            console.log('daily cron job started at ' + new Date());

            let page = 1;
            /******************* Cron Minute Job ************/
            task = cron.schedule('* * * * *', async () => {
                console.log('minute cron job started at ' + new Date());
                try {
                    WooCommerce.get('products?page=' + page + '&per_page=50', async function (err, data, res) {
                        // console.log(res);
                        let products = JSON.parse(res);
                        if (products && products.length > 0) {
                            console.log("Page " + page + " :: no of products " + products.length)
                            page = page + 1;
                            products.forEach(async element => {
                                if (element.type == 'simple') {
                                    let product = {};
                                    product.product_id = Number(element.id);
                                    product.product_name = element.name;
                                    product.product_sku = element.sku;
                                    product.regular_price = Number(element.regular_price).toFixed(2);
                                    product.sale_price = element.sale_price != "" ? Number(element.sale_price).toFixed(2) : Number(element.regular_price).toFixed(2);
                                    product.product_url = element.permalink;
                                    product.images = element.images;
                                    product.categories = element.categories;

                                    const existingProd = await ProductRepo.getByField({
                                        product_id: Number(element.id)
                                    });

                                    if (existingProd == null) { // create new product
                                        product.createdAt = new Date();
                                        product.updatedAt = new Date();
                                        const newProduct = await ProductRepo.save(product);
                                    } else { // update existing product
                                        if (element.date_created != element.date_modified) {
                                            product.updatedAt = new Date();
                                            const updateProduct = await ProductRepo.updateByField({
                                                product_id: Number(element.id)
                                            }, product);
                                        }
                                    }
                                } else if (element.type == 'variable') {
                                    element.variations.forEach(async variant => {
                                        let product = {};
                                        product.product_id = Number(element.id);
                                        product.product_name = element.name;
                                        product.product_sku = element.sku;
                                        product.variant_id = Number(variant.id);
                                        product.variant_sku = variant.sku;
                                        product.regular_price = Number(variant.regular_price).toFixed(2);
                                        product.sale_price = variant.sale_price != "" ? Number(variant.sale_price).toFixed(2) : Number(variant.regular_price).toFixed(2);
                                        product.product_url = variant.permalink;
                                        product.images = variant.images;
                                        product.categories = element.categories;

                                        const existingProd = await ProductRepo.getByField({
                                            product_id: Number(element.id),
                                            variant_id: Number(variant.id)
                                        });

                                        if (existingProd == null) { // create new product
                                            product.createdAt = new Date();
                                            product.updatedAt = new Date();
                                            const newProduct = await ProductRepo.save(product);
                                        } else { // update existing product
                                            if (variant.date_created != variant.date_modified) {
                                                product.updatedAt = new Date();
                                                const updateProduct = await ProductRepo.updateByField({
                                                    product_id: Number(element.id),
                                                    variant_id: Number(variant.id)
                                                }, product);
                                            }
                                        }
                                    });
                                }
                                // else if (element.type == 'grouped') {

                                // } else {

                                // }
                            });
                        } else {
                            console.log('minute cron job stopped at ' + new Date());
                            task.stop();
                        }
                    });

                } catch (error) {
                    throw error;
                }
            });
            /******************* Cron Minute Job ************/
        });

        return {
            status: 200,
            data: [],
            message: 'Cron Started Successfully'
        };
    } catch (error) {
        return {
            "success": false,
            "status": 500,
            data: [],
            "message": 'Something went wrong'
        }
    }
};

exports.getProductsAndActionStop = async (req) => {
    try {
        console.log('cron task stopped at ' + new Date());
        task.stop();
        return {
            status: 200,
            data: [],
            message: 'Cron Stopped Successfully'
        };
    } catch (error) {
        return {
            "success": false,
            "status": 500,
            data: [],
            "message": 'Something went wrong'
        }
    }
};

exports.getAllProduct = async (req) => {
    try {
        const success = await ProductRepo.getAllProduct();
        return {
            status: 200,
            data: success,
            message: 'Products Fetched Successfully'
        };
    } catch (error) {
        return {
            "success": false,
            "status": 500,
            data: [],
            "message": 'Something went wrong'
        }
    }
};