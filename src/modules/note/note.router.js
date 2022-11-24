import { Router } from "express";
import { noteModel } from "../../../DB/models/note.model.js";
import cloudinary from '../../services/cloudinary.js'
import { HME, multerValidation, myMulter, pathName } from "../../services/multer.js";
import { auth } from '../../middleware/auth.js'
import { userModel } from "../../../DB/models/user.model.js";
import * as noteController from '../note/controller/note.js'
import * as noteValidator from '../note/note.validation.js'
import {validation} from '../../middleware/validation.js'
const router = Router()




router.get('/getNotes/:page?/:size?',auth(),validation(noteValidator.getNotes,'/note/getNotes/:page?/:size?'),noteController.getNotes)
router.get('/DisplayAddNote/:id?',auth(),noteController.displayAddNote)
router.post('/addNote/:id?' , myMulter(multerValidation.image,pathName.notePic,false).single('notePic'),
    HME('/note/DisplayAddNote'), auth(),validation(noteValidator.AddNote,'/note/DisplayAddNote'), noteController.addNote)
router.get('/delete/:id',validation(noteValidator.deleteNote,'/note/getNotes/1/10'),noteController.deleteNote)
router.get('/DisplayNoteUpdate/:id',validation(noteValidator.deleteNote,'/note/getNotes/1/10'),noteController.displayAddNote)
 
export default router