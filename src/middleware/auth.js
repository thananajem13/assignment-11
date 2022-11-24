import { userModel } from "../../DB/models/user.model.js"



export const auth = () => {
    return async (req, res, next) => {
console.log({logedIn:req.session?.user?.isLoggedIn,loggedID:req.session?.user?.id});
        if (!req.session || !req.session?.user?.id || !req.session?.user?.isLoggedIn) {
           return res.render('login', { messageErr: 'In-valid session information', oldInputs: {}, validationErr: [{}] })
        } else {
            const user = await userModel.findOne({_id:req.session.user.id,confirmEmail:true})
            if (!user) {
             return   res.render('login', { messageErr: 'Account not register or unConfirm email account', oldInputs: user, validationErr: [{}]  })
            } else {
                next()
            }
        }
    }
}