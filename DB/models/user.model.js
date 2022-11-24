import { Schema, Types, model } from 'mongoose'


const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: String,
    role: { type: String, default: 'User' },
    profilePic: { type: String,default:null },
    confirmEmail: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
   notes:[{type:Types.ObjectId,default:null,ref:"Note"}] 
}, {
    timestamps: true
})

export const userModel = model('User', userSchema)