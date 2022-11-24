import { userModel } from "../../../../DB/models/user.model.js";
import cloudinary from "../../../services/cloudinary.js";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import sendEmail from "../../../services/email.js";
import { paginate } from "../../../services/pagination.js";
import { noteModel } from "../../../../DB/models/note.model.js";
export const addProfilePic = async (req, res) => {

    if (!req.file) {
        req.flash('image', 'image required')
        res.redirect('/user/profile')
    } else {
        console.log({ path: req.file.path });
        const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
            folder: 'user/profilePic'
        })
        console.log({ secure_url });
        const user = await userModel.findOneAndUpdate({ _id: req.session.user.id },
            { profilePic: secure_url }, { new: true })
        console.log({ updatedUser: user });
        res.redirect('/user/profile')
    }

}

export const getProfile = async (req, res) => {
    const user = await userModel.findById(req.session?.user?.id)
    console.log({ user });
    user.isLoggedIn = true
    const messageErr = req.flash('image')[0]
    const validationErr = req.flash('validationErr')
    // const validationMessage = req.flash('validationMessage')


    // res.render('profile', { user, messageErr: validationMessage.length ? validationMessage : messageErr })
    res.render('profile', { user, messageErr:[] })
    // res.render('profile', { user, messageErr: validationErr.length ? validationErr : messageErr })
}

export const displayUpdateAccount = async (req, res) => {
    const loggedInUser = req.session?.user?.id
    const user = await userModel.findById({ _id: loggedInUser, })
    console.log({ user });
    if (user) {
        const oldInputs = req.flash('oldInputs')[0]
        // console.log({ oldInputInsideUpdateProfile: oldInputs });
        const validationErr = req.flash('validationErr')

        res.render('updateProfile', { messageErr: 'update your profile',
        //  oldInputs:user,
         oldInputs: oldInputs ? oldInputs : user,
          user: loggedInUser, validationErr })
    } else {
        res.render('profile', { user, messageErr: "your account fail to update or your are not owner of this account, or invalid id or your account is deleted successfully" })
    }
}
export const deleteAccount = async (req, res) => {
    // const { id } = req.params
    const loggedInUser = req.session?.user?.id


    console.log({ eq: id == loggedInUser });
    // const userIn = await userModel.findById({ _id: loggedInUser })
    // console.log({ userIn });
    // if (id == loggedInUser) {
    const user = await userModel.findByIdAndDelete({ _id: loggedInUser, })
    console.log({ user });
    if (user) {
        // alert('your account deleted successfully')
        // res.render('profile', { user,messageErr: "your account deleted successfully"})
        //redirect into login
        res.render('login', { messageErr: 'your account deleted successfully', oldInputs: user, validationErr: [{}] })

        //  res.redirect('/auth/signin')
    } else {
        res.render('profile', { user, messageErr: "your account fail to delete or your are not owner of this account, or invalid id or your account is deleted successfully" })
    }
    // } else {

    //     res.render('profile', { user, messageErr: "Your're un authenticated, invalid id" })

    // }



}

export const updateProfile = async (req, res) => {
    // const { id } = req.params
    const loggedInUser = req.session?.user?.id

    const logedUser = await userModel.findOne({ _id: loggedInUser })
    // if (id == loggedInUser) {
    if (req.body.password) {
        logedUser.password = bcrypt.hashSync(req.body.password, parseInt(process.env.SaltRound))
    } else {
        delete req.body.password
    }
    if (!(req.body.phone)) {
        delete req.body.phone

    }
    console.log({ checkIfBdyEmailEqToLoggedEmail: req.body.email && req.body.email != logedUser.email })
    console.log({ emailBody: req.body.email })
    console.log({ LoggedEmail: logedUser.email })
    console.log({ loggedInUser })
    let emailMsg = ``
    if (req.body.email && req.body.email != logedUser.email) {
        const token = jwt.sign({ id: loggedInUser }, process.env.confirmEmailToken)
        const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
        const message = `
         <a href="${link}">click here to confirm your email</a>`
        const EmailInfo = await sendEmail(req.body.email, 'confirmation mail', message)
        console.log({ len: EmailInfo?.accepted?.length });
        console.log({ lenAccepted: EmailInfo?.accepted });
        console.log({ EmailInfo });
        if (EmailInfo?.accepted?.length) {
            logedUser.email = req.body.email
            logedUser.confirmEmail = false
            emailMsg = `, please confirm your new email: ${req.body.email}`
            // const updateUserEmail = await userModel.findOneAndUpdate({ _id: loggedInUser, confirmEmail: true }, { confirmEmail: false }, { new: true })
            // if(updateUserEmail){

            // }
        }
    }
    if (req.body.name) {
        logedUser.name = req.body.name
    }
    console.log({ logedUser })
    const user = await logedUser.save()
    const oldInputs = req.flash('oldInputs')[0]

    // const user = await userModel.findByIdAndUpdate({ _id: loggedInUser }, req.body, { new: true })
    console.log({ updateeeeeeeeeeeee: user, reeeeeeeeeq: req.body });
    if (user) {

        res.render('updateProfile', { user:req.session?.user,oldInputs:user,validationErr:[], messageErr: "Your're updated your profile successfully" + emailMsg })
    } else {
        const validationErr = req.flash('validationErr')

        res.render('updateProfile', {user:req.session?.user, messageErr: 'update your profile' + emailMsg, oldInputs, validationErr })
        // res.render('updateProfile', { messageErr: 'update your profile'+emailMsg, oldInputs: user, validationErr })
    }

    // } else {

    //     res.render('profile', { user, messageErr: "Your're un authenticated, invalid id" })

    // }
}

export const logout = async (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            // data["Data"] = 'Error destroying session';
            // res.json(data);
        } else {
            // data["Data"] = 'Session destroy successfully';
            // res.json(data);
            res.redirect("/auth/login")
            //res.redirect("/login");
        }
    });
}

export const displayUserNotes = async (req, res) => {

    let { page, size } = req.params
    if (!page || isNaN(page)) {
        page = 1
    }
    if (!size || isNaN(size)) {
        size = 2
    }
    const { limit, skip } = paginate(page, size)
    const usersNotes = await userModel.find({}).populate('notes').skip(skip).limit(limit)
    const numberOfPages = Math.ceil(usersNotes.length / size)
    let applyPaginate = true
    if (size >= usersNotes.length && size <= 10) {
        applyPaginate = false
    }//no pagination appear
    const loggedInUser = req.session?.user?.id
    const userInfo = await userModel.findById(req.session.user.id)
    const validationErr = req.flash('validationErr')
    console.log({ usersNotes, numberOfPages });
    res.render('displayUsersNotes', { applyPaginate, usersNotes, numberOfPages, userInfo, user: req.session?.user, messageErr: validationErr })


}
// export const getUserNotes = async(req,res)=>{
//     let { page, size } = req.params
//     if (!page || isNaN(page)) {
//         page = 1
//     }
//     if (!size || isNaN(size)) {
//         size = 2
//     }
//     const { limit, skip } = paginate(page, size)  
//     const allNotes = await noteModel.find({}).populate('createdBy').skip(skip).limit(limit);

// }
export const getUsers = async (req, res) => {
    const user = req.session?.user?.id
    /* */

    let { page, size } = req.params
    if (!page || isNaN(page)) {
        page = 1
    }
    if (!size || isNaN(size)) {
        size = 2
    }
    const { limit, skip } = paginate(page, size)
    const users = await userModel.find({}).skip(skip).limit(limit)
    const numberOfPages = Math.ceil(users.length / size)
    let applyPaginate = true
    if (size >= users.length && size <= 10) {
        applyPaginate = false
    }//no pagination appear
    const loggedInUser = req.session?.user?.id
    const userInfo = await userModel.findById(req.session.user.id)
    const validationErr = req.flash('validationErr')
    /* */
    return res.render('displayUsersNotes', { applyPaginate, users, numberOfPages, userInfo, user: req.session?.user, messageErr: validationErr })

}
export const getSpecificUserNote = async (req, res) => {
    const { id } = req.params
    const user = req.session?.user?.id
    /** */
    /* */

    let { page, size } = req.params
    if (!page || isNaN(page)) {
        page = 1
    }
    if (!size || isNaN(size)) {
        size = 2
    }
    const notes = await noteModel.find({ createdBy: id }).populate('createdBy')
    const { limit, skip } = paginate(page, size)
    const userNotes = await noteModel.find({ createdBy: id }).populate('createdBy').skip(skip).limit(limit)
    const numberOfPages = Math.ceil(notes.length / size)
    let applyPaginate = true
    if (size >= notes.length && size <= 10) {
        applyPaginate = false
    }//no pagination appear
    const loggedInUser = req.session?.user?.id
    const userInfo = await userModel.findById(req.session.user.id)
    const validationErr = req.flash('validationErr')
    /* */
    return res.render('userNote', { applyPaginate, userNotes, numberOfPages, userInfo, user: req.session?.user, messageErr: validationErr })
    /** */

}