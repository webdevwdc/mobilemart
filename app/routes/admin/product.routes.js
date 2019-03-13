const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const querystring = require('querystring');
const multer = require('multer');
const productController = require('product/controllers/product.controller');
const fs = require('fs');
const path = require('path');

const json2csv = require('json2csv').parse;

const Storage = multer.diskStorage({
	destination: (req, file, callback) => {

		if (file.mimetype.indexOf("csv") != -1) {
			// check if directory exists
			if (!fs.existsSync('./public/uploads/product/csv'))
				// if not create directory
				fs.mkdir('./public/uploads/product/csv', {
					recursive: true
				});

			callback(null, "./public/uploads/product/csv");
		} else {
			// check if directory exists
			if (!fs.existsSync('./public/uploads/product'))
				// if not create directory
				fs.mkdir('./public/uploads/product', {
					recursive: true
				});

			callback(null, "./public/uploads/product");
		}

	},
	filename: (req, file, callback) => {
		callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
	}
});

const uploadFile = multer({
	storage: Storage
});
const request_param = multer();

const WooCommerceAPI = require('woocommerce-api');
const WooCommerce = new WooCommerceAPI({
	url: process.env.WooCommerceUrl,
	consumerKey: process.env.WooCommerceConsumerKey,
	consumerSecret: process.env.WooCommerceConsumerSecret,
	wpAPI: true,
	version: 'wc/v3',
});

namedRouter.all('/product*', auth.authenticate);

/*
// @Route: Render Create Product
*/
namedRouter.get("product.create", '/product/create', (req, res) => {
	productController.create(req).then(success => {
		res.render('product/views/add.ejs', {
			page_name: 'product-management',
			page_title: 'Create Product',
			user: req.user,
			response: success
		});
	}, failure => {
		res.status(failure.status).send(failure);
	});
});

/*
// @Route: Create Product Action
*/
namedRouter.post("product.store", '/product/store', uploadFile.any(), (req, res) => {
	productController.store(req).then(success => {
		req.flash('success', success.message);
		res.redirect(namedRouter.urlFor('product.list'));
	}, failure => {
		req.flash('error', failure.message);
		res.redirect(namedRouter.urlFor('product.create'));
	});
});


/*
// @Route: Product List
*/

namedRouter.get("product.list", '/product/list', request_param.any(), async (req, res) => {

	try {
		const success = await productController.list(req);
		// console.log(success);
		// For search string //
		let searchStr = {
			'keyword': ''
		};
		success.search_param = "";

		if (_.isEmpty(req.query) == false && (_.has(req.query, "keyword"))) {
			searchStr = {
				'keyword': req.query.keyword
			};
			const serachQryStr = querystring.stringify(searchStr);
			success.search_param = "&" + serachQryStr;
		}

		return res.render('product/views/list.ejs', {
			page_name: 'product-management',
			page_title: 'Product List',
			user: req.user,
			postdata: searchStr,
			response: success
		});
	} catch (error) {
		req.flash('error', error.message);
		res.redirect(namedRouter.urlFor('user.login'));
	}
});

/*
// @Route: Render Edit Product
*/
namedRouter.get("product.edit", '/product/edit/:id', async (req, res) => {
	try {
		const success = await productController.edit(req);

		return res.render('product/views/edit.ejs', {
			page_name: 'product-management',
			page_title: 'Update Product',
			user: req.user,
			response: success
		});
	} catch (error) {
		res.status(error.status).send(error);
	}
});

/*
// @Route: Update Product Action
*/
namedRouter.post("product.update", '/product/update', request_param.any(), async (req, res) => {
	const updatedId = req.body.product_id;
	try {
		const success = await productController.update(req);
		req.flash('success', success.message);
		return res.redirect(namedRouter.urlFor('product.list'));
	} catch (error) {
		req.flash('error', error.message);
		return res.redirect(namedRouter.urlFor('product.edit', {
			id: updatedId
		}));
	}
});

/*
// @Route: Render Details Product
*/
namedRouter.get("product.view", '/product/view/:id', async (req, res) => {
	try {
		req.userrole = 'user';
		const success = await productController.edit(req);

		return res.render('product/views/viewdetails.ejs', {
			page_name: 'product-management',
			page_title: 'View Product Details',
			user: req.user,
			response: success,
			userrole: req.userrole
		});
	} catch (error) {
		res.status(error.status).send(error);
	}
});

/*
// @Route: Product status change
*/
namedRouter.post('product.status.change', '/product/status-change', request_param.any(), async (req, res) => {
	try {
		const success = await productController.statusChange(req);
		req.flash('success', success.message);
		return res.send(success);
	} catch (error) {
		req.flash('error', error.message);
		return res.redirect(namedRouter.urlFor('product.list'));
	}
});

/*
// @Route: Delete Product
*/
namedRouter.get('product.delete', '/product/delete/:id', async (req, res) => {
	try {
		const success = await productController.destroy(req);
		req.flash('success', success.message);
		return res.redirect(namedRouter.urlFor('product.list'));
	} catch (error) {
		req.flash('error', error.message);
		return res.redirect(namedRouter.urlFor('product.list'));
	}
});



namedRouter.get("product.viewAll.render", '/product/view_all', async (req, res) => {
	try {
		return res.render('product/views/view.ejs', {
			page_name: 'user-dashboard',
			page_title: 'View All Product',
			user: req.user
		})
	} catch (error) {
		req.flash('error', error.message);
		return res.redirect(namedRouter.urlFor('product.stat', {
			id: req.params.id
		}));
	}
});

namedRouter.post("product.viewAll", '/product/view_all', request_param.any(), async (req, res) => {
	try {
		const success = await productController.getAllProductES(req);
		res.status(success.status).send(success);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

namedRouter.post("product.byNameorSku", '/product/byNameorSku',request_param.any(), async (req, res) => {
	try {
		const success = await productController.getAllProductESByNameOrSKU(req);
		res.status(success.status).send(success);
	} catch (error) {
		res.status(500).send(error.message);
	}
});


namedRouter.get("product.category", '/product/category', async (req, res) => {
	try {
		WooCommerce.get('products/categories?search=' + req.query.search + '&page=' + parseInt(req.query.page) + '&per_page=30', function (err, data, response) {
			if (err) {
				throw err;
			} else {
				const success = {
					"status": 200,
					data: JSON.parse(response),
					"message": 'Data stored successfully'
				};
				res.status(success.status).send(success);
			}
		});

	} catch (error) {
		res.status(500).send(error.message);
	}
});
/*
// @Route: Export Product
*/

namedRouter.get('product.export.csv', '/product/export', async (req, res) => {
	try {
		const success = await productController.getallforCSV();
		const allKeys = _.keys(success.data[0]);
		const fields = _.without(allKeys, '_id', 'images', 'isDeleted', 'status', 'createdAt', 'updatedAt', '__v');
		const opts = {
			fields
		};
		const data = json2csv(success.data, opts);
		res.attachment('products.csv');
		res.status(200).send(data);
	} catch (error) {
		req.flash('error', error.message);
		return res.redirect(namedRouter.urlFor('product.list'));
	}
});

namedRouter.post('product.import.csv', '/product/import', uploadFile.any(), async (req, res) => {
	try {
		const success = await productController.importProductCSV(req);
		// console.log(success)
		req.flash('success', success.message);
		return res.send(success);
		// return res.redirect(namedRouter.urlFor('product.list'));
	} catch (error) {
		req.flash('error', error.message);
		return res.redirect(namedRouter.urlFor('product.list'));
	}
});

namedRouter.get("product.stat", '/product/stat/:id', async (req, res) => {
	try {
		return res.render('user/views/chart.ejs', {
			page_name: 'user-dashboard',
			page_title: 'Product Statistics',
			user: req.user
		})
	} catch (error) {
		req.flash('error', error.message);
		return res.redirect(namedRouter.urlFor('product.stat', {
			id: req.params.id
		}));
	}
});

namedRouter.post("product.stat.fetch", '/product/stat', request_param.any(), async (req, res) => {
	try {
		const success = await productController.getProdutHistoryElasticSearch(req);
		res.status(success.status).send(success);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

namedRouter.post('product.export.csv.daterange', '/product/export_date_range', request_param.any(), async (req, res) => {
	try {
		// console.log(req.body);
		const products = await productController.getRecordFrmHistory(req);

		const allKeys = ['product_id', 'product_name',
			'product_sku',
			'competitor_1_start_date_login_price',
			'competitor_1_end_date_login_price',
			'competitor_1_start_date_retail_price',
			'competitor_1_end_date_retail_price',
			'competitor_2_start_date_login_price',
			'competitor_2_end_date_login_price',
			'competitor_2_start_date_retail_price',
			'competitor_2_end_date_retail_price',
			'competitor_3_start_date_login_price',
			'competitor_3_end_date_login_price',
			'competitor_3_start_date_retail_price',
			'competitor_3_end_date_retail_price',
			'competitor_4_start_date_login_price',
			'competitor_4_end_date_login_price',
			'competitor_4_start_date_retail_price',
			'competitor_4_end_date_retail_price'];

		const fields = _.without(allKeys, 'product_id');
		const opts = {
			fields
		};
		const data = json2csv(products.data, opts);
		res.attachment('products.csv');
		res.status(200).send(data);
	} catch (error) {
		req.flash('error', error.message);
		return res.redirect(namedRouter.urlFor('product.list'));
	}
});



// Export the express.Router() instance
module.exports = router;