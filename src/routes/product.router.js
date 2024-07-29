import { Router } from "express";
import ProductManager from '../Class/productManager.js';
import {__dirname} from '../utils.js';

const router = Router();
const productManager = new ProductManager( __dirname + '/data/product.json');
router.post('/', async (req,res) => {
    //console.log("Entro en el Post");
    await productManager.addProduct(req.body);
    //console.log("Ya creo el archivo product");
    res.status(201).json({ message : 'Producto añadido correctamente'})
    

});
router.delete('/:pid', async (req, res) => {
    console.log("Entro en el delete");
    const { pid } = req.params;
    console.log("Delete : " + Number(pid));
    const productDelete = await productManager.deleteProduct(Number(pid));

    if (productDelete) {
        res.status(200).json({ resultado: "Producto Borrado" });
    } else {
        res.status(404).json({ mensaje: "Producto no encontrado" });
    }

})

router.get('/', async (req, res) => {
    const { limit } = req.query;
    console.log("limit : " + limit);
    const productList = await productManager.getProductList(limit ? Number(limit) : null);
    console.log(productList);
    res.status(200).json({ resultado: productList });
});



router.get('/:pid', async (req, res) => {
    const { pid } = req.params;  
    
    const productFind = await productManager.getProductById(Number(pid));
    console.log("entro /:pid " + pid);
    
    if (productFind) {
        res.status(200).json({ resultado: productFind });
    } else {
        res.status(404).json({ mensaje: "Producto no encontrado" });
    }
});



router.put('/:pid',async (req,res) => { 
    const { pid } = req.params
    const productoActualizar = req.body

    const updateProduct = await productManager.updateProduct(Number(pid), productoActualizar)
    
    if (updateProduct) {
        res.status(200).json({ resultado: "Producto Actualizado" });
    } else {
        res.status(404).json({ mensaje: "Producto no encontrado" });
    }
});

export default router;