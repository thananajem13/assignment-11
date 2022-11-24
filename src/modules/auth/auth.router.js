import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from './auth.validation.js'
import * as authController from './controller/auth.js'
const router = Router()



router.get('/login', authController.displayLogin) 

router.post('/signin',validation(validators.signin , '/auth/login'),authController.handleLogin)


router.get('/signup', authController.displaySignUp) 


router.get('/confirmEmail/:token',validation(validators.confirmEmail),authController.confirmEmail)

router.post('/signup', validation(validators.signup, '/auth/signup') ,authController.handleSignUp)

export default router