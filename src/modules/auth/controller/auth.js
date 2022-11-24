
import { userModel } from '../../../../DB/models/user.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import   sendEmail   from "../../../services/email.js";

export const  displayLogin = (req, res) => {
    const oldInputs = req.flash('oldInputs')[0]
    const messageErr = req.flash('messageErr')[0]
    const validationErr = req.flash('validationErr') || []
    const emailCheck= req.flash('emailCheck')
if(req?.session?.user?.id){
    res.redirect("/user/profile")

}else{
    res.render('login', { messageErr:emailCheck, oldInputs , validationErr })
}
}
export const handleLogin =  async (req, res) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email,confirmEmail:true })
    if (!user) {
        req.flash('oldInputs', req.body)
        req.flash('messageErr', 'Email Not Exist or your email not confirmed')
        res.redirect("/auth/login")
    } else {
        const match = bcrypt.compareSync(password, user.password)
        console.log(match);
        if (!match) {
            req.flash('oldInputs', req.body)
            req.flash('messageErr', 'In-valid Password')
            res.redirect("/auth/login")
        } else {
            req.session.user = {
                id: user._id,
                isLoggedIn: true
            }
            res.redirect("/user/profile")
        }
    }
}
export const displayHomepage = (req,res)=>{
    res.render('homepage',{user:req.session?.user})

}
export const displaySignUp = (req, res) => {
    // console.log(req.flash('messageErr'));
    const messageErr = req.flash('messageErr')[0]
    const oldInputs = req.flash('oldInputs')[0]
    const validationErr = req.flash('validationErr')

    console.log(validationErr);
    res.render('signup', { messageErr, oldInputs  , validationErr})
}
export const handleSignUp = async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body
    const user = await userModel.findOne({ email }).select('email')
    if (user) {
        req.flash('messageErr', 'Email Exist')
        req.flash('oldInputs', req.body)
        res.redirect("/auth/signup")
    } else {
        const hash = bcrypt.hashSync(password, parseInt(process.env.SaltRound))
        const savedUser = await userModel.create({ name, email, password: hash })
        const token = jwt.sign({ id: savedUser._id }, process.env.confirmEmailToken, { expiresIn: 60 * 60 * 24 })
        const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
        const message = `
        <a href='${link}'>ConfirmEmail</a>`
       await sendEmail(email, 'confirmEmail', message)
       req.flash('emailCheck','please confirm your email')
        res.redirect('/auth/login')
    }

}
export const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params

        const decoded = jwt.verify(token, process.env.confirmEmailToken)
        console.log({ decoded });
        if (!decoded?.id) {
            // return res.status(400).json({ message: "in-valid token payload" })
            return res.render('login',{messageErr:"in-valid token payload",oldInputs:{},validationErr:[{}]})
             
        } else {
            const user = await userModel.findOneAndUpdate({ _id: decoded.id, confirmEmail: false },
                { confirmEmail: true })
            if (!user) {

                // return res.status(400).json({ message: "Already confirmed" })
                return res.render('login',{messageErr:"Already confirmed",oldInputs:user,validationErr:[{}]})
            } else {
                return res.render('login',{messageErr:"Email confirmed plz login",oldInputs:user,validationErr:[{}]})
                // return res.status(200).json({ message: "Email confirmed plz login" })

            }
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })

    }
}
