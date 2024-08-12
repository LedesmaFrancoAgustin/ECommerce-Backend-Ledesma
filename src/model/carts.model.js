import { Schema , model } from "mongoose";

const cartSchema = new Schema({
    products: [{
        idProduct: { type: Schema.Types.ObjectId, ref: 'products' },
        quantity: { type: Number, required: true }
    }]
    
})
export const CartsModel = model('carts',cartSchema)