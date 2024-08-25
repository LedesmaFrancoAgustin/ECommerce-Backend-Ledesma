import { Router } from "express";
import { ProductModel } from "../model/producto.model.js";

const router = Router()

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query;
        const queryLimit = parseInt(limit, 10);
        const queryPage = parseInt(page, 10);

        if (isNaN(queryLimit) || queryLimit <= 0 || isNaN(queryPage) || queryPage <= 0) {
            return res.status(400).json({ status: 'error', message: 'Límite y página deben ser números positivos.' });
        }

        const result = await ProductModel.paginate({}, { 
            limit: queryLimit, 
            page: queryPage,
            lean: true 
        });

        const prevLink = result.hasPrevPage ? `/?limit=${queryLimit}&page=${result.prevPage}` : null;
        const nextLink = result.hasNextPage ? `/?limit=${queryLimit}&page=${result.nextPage}` : null;

        res.render('index', { 
            productList: result.docs, 
            totalPages: result.totalPages,
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

export default router;
