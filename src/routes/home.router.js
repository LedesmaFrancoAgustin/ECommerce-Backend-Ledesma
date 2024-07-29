import { Router } from "express";
import ProductManager from '../Class/productManager.js';
import {__dirname} from '../utils.js';

const productManager = new ProductManager( __dirname + '/data/product.json');

const app = Router();
app.get('/', async (req, res) => {
    const { limit } = req.query;
    const productList = await productManager.getProductList(limit ? Number(limit) : null);
    res.render('home', { productList: productList });
});



export default app;