const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);

// const multer = require('multer');
// const request_param = multer();

const productCtrl = require('product/controllers/product.api.controller');

/**
 * @api {get} /products/startCron For Start Cron
 * @apiVersion 0.1.2
 * @apiGroup Product
 * @apiSuccessExample {json} Success
 * { status: 200, data: [], message: 'Cron Started Successfully' }
*/

namedRouter.get("api.products.startCron", '/products/startCron', async (req, res) => {
    try {
        // console.log('city api', req.params)
        const success = await productCtrl.getProductsAndActionStart(req);
        // console.log(JSON.stringify(_.sortBy(success, function(o) { return o.city; })))
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {get} /products/stopCron For Stop Cron
 * @apiVersion 0.1.2
 * @apiGroup Product
 * @apiSuccessExample {json} Success
 * { status: 200, data: [], message: 'Cron Stopped Successfully' }
*/

namedRouter.get("api.products.stopCron", '/products/stopCron', async (req, res) => {
    try {
        // console.log('city api', req.params)
        const success = await productCtrl.getProductsAndActionStop(req);
        // console.log(JSON.stringify(_.sortBy(success, function(o) { return o.city; })))
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

namedRouter.all('/products*', auth.authenticateAPI);

/**
 * @api {get} /products Get All Products
 * @apiVersion 0.1.2
 * @apiGroup Product
 * @apiHeader x-access-token User's Access Token
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": [{
            "_id": "5c6598f7a5f62a5381b2c4d6",
            "product_name": "Galaxy S7 (G930F) LCD and Digitizer Touch Screen Assembly (Samsung Service Pack) - Rose Gold",
            "product_sku": "934721101992",
            "variant_id": null,
            "variant_sku": "",
            "buy_price": 0,
            "wholesale_price": 0,
            "regular_price": 165,
            "sale_price": 165,
            "product_url": "https://www.mobile-mart.com.au/product/galaxy-s7-g930f-lcd-and-digitizer-touch-screen-assembly-samsung-service-pack-rose-gold/",
            "images": [
                {
                    "id": 6148,
                    "date_created": "2018-11-22T01:04:44",
                    "date_modified": "2018-11-22T01:04:44",
                    "src": "https://www.mobile-mart.com.au/wp-content/uploads/2018/11/Galaxy-S7-G930F-LCD-and-Digitizer-Touch-Screen-Assembly-Samsung-Service-Pack-Rose-Gold.jpg",
                    "name": "Galaxy S7 (G930F) LCD and Digitizer Touch Screen Assembly (Samsung Service Pack) &#8211; Rose Gold",
                    "alt": "",
                    "position": 0
                }
            ],
            "comp1_product_link": "",
            "comp1_product_price": 0,
            "comp2_product_link": "",
            "comp2_product_price": 0,
            "comp3_product_link": "",
            "comp3_product_price": 0,
            "comp4_product_link": "",
            "comp4_product_price": 0,
            "isDeleted": false,
            "status": "Active",
            "product_id": 6146,
            "createdAt": "2019-02-14T16:36:07.833Z",
            "updatedAt": "2019-02-14T16:36:07.833Z",
            "__v": 0
        },
        {
            "_id": "5c6598f7a5f62a5381b2c4d7",
            "product_name": "iPhone X LCD and Digitizer Touch Screen Assembly (AAA Quality) - Black",
            "product_sku": "934721101991",
            "variant_id": null,
            "variant_sku": "",
            "buy_price": 0,
            "wholesale_price": 0,
            "regular_price": 250,
            "sale_price": 250,
            "product_url": "https://www.mobile-mart.com.au/product/iphone-x-lcd-and-digitizer-touch-screen-assembly-aaa-quality-black/",
            "images": [
                {
                    "id": 5915,
                    "date_created": "2018-11-12T04:31:47",
                    "date_modified": "2018-11-12T04:31:47",
                    "src": "https://www.mobile-mart.com.au/wp-content/uploads/2018/11/HdZjkYr4QA65bkHOUY0D_iPhone_X_LCD_and_Digitizer_Touch_Screen_Assembly__AAA_Quality__-_Black.jpg",
                    "name": "HdZjkYr4QA65bkHOUY0D_iPhone_X_LCD_and_Digitizer_Touch_Screen_Assembly__AAA_Quality__-_Black.jpg",
                    "alt": "",
                    "position": 0
                }
            ],
            "comp1_product_link": "",
            "comp1_product_price": 0,
            "comp2_product_link": "",
            "comp2_product_price": 0,
            "comp3_product_link": "",
            "comp3_product_price": 0,
            "comp4_product_link": "",
            "comp4_product_price": 0,
            "isDeleted": false,
            "status": "Active",
            "product_id": 5914,
            "createdAt": "2019-02-14T16:36:07.849Z",
            "updatedAt": "2019-02-14T16:36:07.849Z",
            "__v": 0
        }],
    "message": "Products Fetched Successfully"
}
*/

namedRouter.get("api.products", '/products', async (req, res) => {
    try {
        const success = await productCtrl.getAllProduct();
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

module.exports = router;