import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new Schema({
  title: String,
  description: String, 
  code: String, 
  price: Number, 
  status: Boolean, 
  stock: String, 
  category: String, 
  thumbnails: []
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = model('products', productSchema);
