import { Router } from "express";
import { ProductModel } from "../model/producto.model.js";
import ProductManager from '../Class/productManager.js';
import {__dirname} from '../utils.js';

const router = Router();
const productManager = new ProductManager( __dirname + '/data/product.json');
router.post('/', async (req,res) => {

   const { title, description, code, price,  status, stock, category, thumbnails} = req.body;
   await ProductModel.create({
    title, description, code, price,  status, stock, category, thumbnails
   })
    res.status(201).json({ message : 'Producto añadido correctamente'})
    

});
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;

        const productDelete = await ProductModel.findByIdAndDelete(pid);

        if (productDelete) {
            res.status(200).json({ resultado: "Producto Borrado" });
        } else {
            res.status(404).json({ mensaje: "Producto no encontrado" });
        }
    } catch (error) {
        console.error('Error al borrar el producto:', error);
        res.status(500).json({ mensaje: 'Error al borrar el producto', error: error.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', query = '' } = req.query;

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
        };

        if (isNaN(options.page) || options.page <= 0) {
            return res.status(400).json({ status: 'error', message: 'La página debe ser un número positivo.' });
        }

        if (isNaN(options.limit) || options.limit <= 0) {
            return res.status(400).json({ status: 'error', message: 'El límite debe ser un número positivo.' });
        }

        let searchFilter = {};
        if (query) {
            const [field, value] = query.split(':');
            if (field && value) {
                searchFilter[field] = new RegExp(value, 'i');
            } else {
                return res.status(400).json({ status: 'error', message: 'El formato de query no es válido. Debe ser campo:valor.' });
            }
        }

        const result = await ProductModel.paginate(searchFilter, options);

        const prevLink = result.hasPrevPage ? `/api/products?limit=${options.limit}&page=${result.prevPage}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;
        const nextLink = result.hasNextPage ? `/api/products?limit=${options.limit}&page=${result.nextPage}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;

        res.status(200).json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ status: 'error', message: 'Error al obtener los productos', error: error.message });
    }
});

router.get('/:pid', async (req, res) => {

    try{
        const { pid } = req.params;  
        const productFind = await ProductModel.findById(pid);
        res.status(200).json({ resultado: productFind });
    }catch (error){
        res.status(404).json({ mensaje: "Producto no encontrado" });
    }
});



router.put('/:pid',async (req,res) => { 

    try{
        const { pid } = req.params
        const productoActualizar = req.body
        const updateProduct = await ProductModel.findByIdAndUpdate(pid,{
            ... productoActualizar
        },{new:true})
        res.status(200).json({ message: "Producto Actualizado",payload: productoActualizar });
      
    }catch (error){
        res.status(404).json({ mensaje: "Producto no encontrado" });
    }
});

export default router;