
import { noteModel } from "../../../../DB/models/note.model.js"
import { userModel } from "../../../../DB/models/user.model.js"
import cloudinary from "../../../services/cloudinary.js"
import { paginate } from '../../../services/pagination.js'
var ifGetNotesCalled = false
var usersNotes=[]
export const getNotes = async (req, res) => {
     usersNotes = await noteModel.find({}).populate({
        path: 'createdBy',
    })
    const userInfo = await userModel.findById({ _id: req.session?.user?.id })
    let { page, size } = req.params
    if (!page || isNaN(page)) {
        page = 1
    }
    if (!size || isNaN(size)) {
        size = 10
    }
    const numberOfPages = Math.ceil(usersNotes.length / size)
    let applyPaginate = true
    if (size >= usersNotes.length && size <= 10) {
        applyPaginate = false
    }//no pagination appear

    const { limit, skip } = paginate(page, size)
    const notes = await noteModel.find({}).populate({
        path: 'createdBy',
    }).skip(skip).limit(limit)
    const multerErr = req.flash('multerErr')
    const messageErr = req.flash('messageErr')
 
  return  res.render('displayNotes', { applyPaginate, notes, numberOfPages, userInfo,user:req.session?.user, 
        messageErr: multerErr.length?  multerErr : messageErr   })
        
}
export const displayAddNote = async (req, res) => {
    const user = req.session?.user
    const validationErr = req.flash('validationErr')
    if(req.params.id){
        var note = await noteModel.findById({_id:req.params.id}).lean()
    }
    console.log({noteINSIDE:note});
    // if(req.params.id){
    //     //update
    //     note.updateID = req.params.id

    // }
    res.render('addNote', { oldInputs: {}  , messageErr: [], user, data: note || {}, validationErr })
}
export const addNote = async (req, res) => {
    const user = req.session?.user
    const { noteBody } = req.body
    const validationErr = req.flash('validationErr')
    const oldInputs = req.flash('oldInputs')
if(req.params.id){
    var updateNote = await noteModel.findById({_id:req.params.id})
    
}else{
    var updateNote = new noteModel({}) 
} 
    updateNote.noteBody = noteBody
    updateNote.createdBy = user.id

    if (req.file) {
        const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
            folder: `user/notePic/${req.session?.user?.id}`
        })
        updateNote.notePic = secure_url
         }
        
          const updateNotes = await updateNote.save()
        if(updateNotes){
            var updateID = updateNotes._id;
            const userUpdate =  await userModel.findByIdAndUpdate({_id:user.id},{ $push: { notes: updateID } },{new:true})
            if(userUpdate){
                var messageErr = 'data updated/added successfully'
            }else{
                messageErr= 'failed to update/add data'
            }     
            
            req.flash('messageErr',messageErr)

            return res.redirect('/note/getNotes/1/10')
          }else{
            messageErr ='failed to update note'
            req.flash('messageErr',messageErr)

            return res.redirect(`/DisplayAddNote/${updateID}`)
            
         }   
}
export const deleteNote = async(req,res)=>{
    const {id} = req.params
    const deletedNote = await noteModel.findByIdAndDelete({_id:id}) 
    ifGetNotesCalled = true 
    if(deletedNote){
      var messageErr="note deleted successfully"
    }else{
        messageErr="fail to delete note" 
    } 
    req.flash('messageErr',messageErr) 
    res.redirect('/note/getNotes/1/10') 

    
}