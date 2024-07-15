// npm init -y
//npm install nodemon
//npm i express  
// "type": "module",

import express from 'express';

import productsRouter from './routes/product.router.js';
import cartsRouter from './routes/carts.router.js';


const app = express();
app.use(express.json());
app.use(express.urlencoded( {extended: true} ));

app.use('/api/products',productsRouter)
app.use('/api/carts', cartsRouter)





//Cart
app.post('/:cid/product/:pid',async(req,res) => {
    const { cid,pid} = req.params

    //mi metodo await cartmanager.addpro
})
app.listen(8080,() => {
    console.log('server listening on ')  
})