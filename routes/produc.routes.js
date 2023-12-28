const { Router } = require('express')
const route = Router();
const { body, param } = require('express-validator');
const { getProducts, getProductById, createProduct, editProduct, disableProduct, deleteProduct } = require('../controllers/product.controller');
const { authMiddleware } = require('../routes/validate-token');

route.get('/get-products', getProducts);
route.get('/get-product-by-Id/:id', getProductById);
route.post('/create-product', createProduct);
route.patch('/edit-product/:id', editProduct);
route.patch('/disable-product/:id', disableProduct);
route.delete('/delete-product/:id', deleteProduct);

module.exports = route;