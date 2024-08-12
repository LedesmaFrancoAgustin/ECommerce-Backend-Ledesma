import { Schema , model } from "mongoose";

const productSchema = new Schema({
     title: String,
     description: String, 
     code: String, 
     price: Number, 
     status: Boolean, 
     stock: String, 
     category: String, 
     thumbnails: []
    
})
export const ProductModel = model('products',productSchema)