// File: Class/cartManagerMongo.js

import { CartsModel } from '../model/carts.model.js';

class CartManagerMG {
    static async addCartMongo(product) {
       

        
        try {
            const { idProduct, quantity } = product;
            if (!idProduct || !quantity || quantity <= 0) {
                throw new Error('El idProduct y la cantidad del producto son requeridos y la cantidad debe ser mayor que 0.');
            }

                await CartsModel.create({
                    products: [{ idProduct, quantity }]
                });
            
        } catch (error) {
            console.error('Error adding product to cart:', error);
            throw error; // Re-throw error to be caught by the caller
        }
    }
}

export default CartManagerMG;
