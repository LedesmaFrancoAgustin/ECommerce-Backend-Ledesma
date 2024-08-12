import { Schema , model } from "mongoose";

const userSchema = new Schema({
    username: String,
    password: String,
    email: String
})
export const UserModel = model('usuarios',userSchema)