import { Router } from "express";
import { ProductModel } from "../model/producto.model.js";

const router = Router()

router.get('/', async(req, res) => {

    try {
        const { limit } = req.query;
        const queryLimit = limit ? Number(limit) : 10; 

        if (isNaN(queryLimit) || queryLimit <= 0) {
            return res.status(400).json({ status: 'error', message: 'El límite debe ser un número positivo.' });
        }

        const productList = await ProductModel.find().limit(queryLimit).lean();
        
        //console.log(productList)
        res.render('index', { productList})


    } catch (error) {
        console.error('Error al obtener los carritos:', error);
        res.status(500).json({ status: 'error', message: 'Error al obtener los carritos', error: error.message });
    }

    
})

export default router;