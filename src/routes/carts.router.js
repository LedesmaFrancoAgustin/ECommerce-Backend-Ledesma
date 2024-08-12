import { Router } from "express";
import { CartsModel } from "../model/carts.model.js";
import { ProductModel } from "../model/producto.model.js";
import CartManager from "../Class/cartManager.js";
import {__dirname} from '../utils.js';


const router = Router();
//const cartManager = new CartManager( __dirname + '/data/cart.json');

router.post('/', async (req, res) => {
    try {
        const { idProduct, quantity } = req.body;
        if (!idProduct || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'El idProduct y la cantidad del producto son requeridos y la cantidad debe ser mayor que 0.' });
        }
            await CartsModel.create({
                products: [{ idProduct, quantity }]
            });
        

        res.status(201).json({ message: 'Producto añadido correctamente' });

    } catch (error) {
        console.error('Error al añadir el producto al carrito:', error);
        res.status(500).json({ message: 'Error al añadir el producto al carrito', error: error.message });
    }
});



router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        // Valida la cantidad
        if (quantity === undefined || quantity <= 0) {
            return res.status(400).json({ status: 'error', message: 'La cantidad debe ser un número positivo.' });
        }

        // Busca el carrito por su ID
        const cart = await CartsModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado.' });
        }

        // Busca el producto dentro del carrito
        const productIndex = cart.products.findIndex(p => p.idProduct.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito.' });
        }

        // Actualiza la cantidad del producto
        cart.products[productIndex].quantity = quantity;

        // Guarda el carrito actualizado
        await cart.save();

        res.status(200).json({ status: 'success', message: 'Cantidad del producto actualizada correctamente' });

    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error al actualizar la cantidad del producto en el carrito', error: error.message });
    }
});



router.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        const queryLimit = limit ? Number(limit) : 10; 

        if (isNaN(queryLimit) || queryLimit <= 0) {
            return res.status(400).json({ status: 'error', message: 'El límite debe ser un número positivo.' });
        }

        const cartList = await CartsModel.find().limit(queryLimit);

        res.status(200).json({ status: 'success', payload: cartList });

    } catch (error) {
        console.error('Error al obtener los carritos:', error);
        res.status(500).json({ status: 'error', message: 'Error al obtener los carritos', error: error.message });
    }
});


router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        // Busca el carrito por su ID 
        const cart = await CartsModel.findById(cid)
            .populate({
                path: 'products.idProduct', 
                select: 'title description code price status stock category thumbnails'
            })
            .exec();

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado.' });
        }

        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error al obtener el carrito', error: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        // Busca el carrito por su ID
        const cart = await CartsModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado.' });
        }

        // Encuentra el índice del producto en el carrito
        const productIndex = cart.products.findIndex(p => p.idProduct.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito.' });
        }

        // Elimina el producto del carrito
        cart.products.splice(productIndex, 1);

        // Guarda el carrito actualizado
        await cart.save();

        res.status(200).json({ status: 'success', message: 'Producto eliminado del carrito correctamente.' });

    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error al eliminar el producto del carrito', error: error.message });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const cartDelete = await CartsModel.findByIdAndDelete(cid);

        if (cartDelete) {
            res.status(200).json({ resultado: "Carrito Borrado" });
        } else {
            res.status(404).json({ mensaje: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error('Error al borrar el Carrito:', error);
        res.status(500).json({ mensaje: 'Error al borrar el Carrito', error: error.message });
    }
});



export default router;