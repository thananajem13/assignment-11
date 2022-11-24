import { Router } from "express";
import { userModel } from "../../../DB/models/user.model.js";
import { auth } from "../../middleware/auth.js";
import cloudinary from "../../services/cloudinary.js";
import * as userController from './controller/user.js'
import { HME, multerValidation, myMulter } from "../../services/multer.js";
import { validation } from "../../middleware/validation.js";
import * as userValidator from './user.validation.js'
const router = Router()



router.get("/profile", auth(),  userController.getProfile)
router.get("/logout", auth(),  userController.logout) 
router.get("/Notes/:page?/:size?", auth(),validation(userValidator.getUsers,'/user/Notes/1/10'),  userController.getUsers)
router.get('/getNotes/user/:id/:page?/:size?',auth(),validation(userValidator.getUserNotes,'/user/Notes/1/10'),userController.getSpecificUserNote)



router.post('/profile/pic', auth(), myMulter(multerValidation.image).single('image'),
    HME('/user/profile'), userController.addProfilePic)
router.get('/delete',auth(),userController.deleteAccount)
 
router.get('/update',auth(),userController.displayUpdateAccount)
router.post('/updateProfile',auth(),validation(userValidator.updateProfile ,'/user/update'),userController.updateProfile)
export default router