// npm init -y
//npm install nodemon
//npm i express  
// "type": "module",

import express from 'express';
import handlebars from 'express-handlebars';


import { __dirname } from './utils.js';

import { Server } from 'socket.io';

import productsRouter from './routes/product.router.js';
import cartsRouter from './routes/carts.router.js';

import ViewRoutersHome from  './routes/home.router.js'
import ViewRoutersRealTimeProducts from  './routes/realTimeProducts.router.js'
import index from  './routes/index.router.js'


import ProductManager from './Class/productManager.js';
import mongoose from 'mongoose';

import CartManagerMG from './Class/cartManagerMongo.js';



const app = express();
app.use(express.json());
app.use(express.urlencoded( {extended: true} ));

app.engine('handlebars',handlebars.engine());
app.set('views',  __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use('/api/products',productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/home', ViewRoutersHome);
app.use('/RealTimeProducts', ViewRoutersRealTimeProducts);
app.use('/index', index);


const productManager = new ProductManager( __dirname + '/data/product.json');

const httpServer =  app.listen(8080,() => {
    console.log('server listening on ')  
})

mongoose.connect('mongodb+srv://ledesmafranco50:BLaLrHEuCZWmMgyV@coderback.rigvj86.mongodb.net/?retryWrites=true&w=majority&appName=coderBack',{dbName: 'coderBack'}).
then(() => {console.log('Conect BD server')})

 export const socketServer = new Server(httpServer)

 socketServer.on('connection', async (socket) => {
    console.log('New client connected. iD: '+ socket.id );

    try {
        const productList = await productManager.getProductList();
        socket.emit('realTimeProducts', productList);
    } catch (error) {
        console.error('Error product list:', error);
    }

    socket.on('addProductToCartMongo', async (product) => {
        try {
            await CartManagerMG.addCartMongo(product);
            console.log('Product added to cart');
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    });

    socket.on('addProductToCart', async (product) => {
        try {
            await productManager.addProduct(product);
            console.log('Product added to cart');
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    });

    socket.on('updateProductForm', async (product) => {
        try {
            await productManager.updateProduct(product.id, product);
            console.log('Product updated');
        } catch (error) {
            console.error('Error updating product:', error);
        }
    });

    socket.on('clearProductForm', async (idProduct) => {
        try {
            await productManager.deleteProduct(idProduct);
            console.log('Product cleared');
        } catch (error) {
            console.error('Error clearing product:', error);
        }
    });
});

//Cart