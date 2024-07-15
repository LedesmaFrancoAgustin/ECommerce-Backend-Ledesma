import { Router } from "express";
import CartManager from "../Class/cartManager.js";
import {__dirname} from '../utils.js';


const router = Router();
const cartManager = new CartManager( __dirname + '/data/cart.json');
router.post('/', async (req,res) => {
    //console.log("Entro en el Post");
    await cartManager.addCart(req.body);
    //console.log("Ya creo el archivo product");
    res.status(201).json({ message : 'Producto añadido correctamente'})
    

});

router.post('/:cid/product/:pid', async (req,res) => {
    //console.log("Entro en el Post");
    const { cid, pid } = req.params;
    //const product =  req.body;
    //console.log("Entro en el post /:cid/product/:pid");
    const cartProduct = await cartManager.addProductToCart(Number(cid),Number(pid));
    if (cartProduct){
        res.status(201).json({ message : 'Producto añadido correctamente al carrito'});
    }else{
        res.status(404).json({ mensaje: "El carrito o el producto no existen" });
    }   
});


router.get('/', async (req, res) => {
    const { limit } = req.query;
    console.log("limit : " + limit);
    const cartList = await cartManager.getCartList(limit ? Number(limit) : null);
    res.status(200).json({ resultado: cartList });
});

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;  
    
    const cartFind = await cartManager.getCartById(Number(cid)); 
    //console.log("entro /:cid " + cid);
    
    if (cartFind) {
        res.status(200).json({ resultado: cartFind });
    } else {
        res.status(404).json({ mensaje: "Producto no encontrado" });
    }
});

export default router;