import { Schema, Types, model } from 'mongoose'


const noteSchema = new Schema({
    noteBody: { type: String, required: true },
    createdBy: { type: Types.ObjectId,   required: true , ref:'User'},
    notePic: {type:String, default:null} , 
}, {
    timestamps: true
})

export const noteModel = model('Note', noteSchema)