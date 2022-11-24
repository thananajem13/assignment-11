
// import multer from 'multer'


// export const HME = (redirectPath) => {
//     return (err, req, res, next) => {
//         if (err) {
//             req.flash('multerErr', err)
//             res.redirect(redirectPath)
//         } else {
//             next()
//         }

//     }
// }


export const multerValidation = {
    image: ['image/png', 'image/jpeg', 'image/jif']
}
// export function myMulter(customValidation = multerValidation.image) {


//     const storage = multer.diskStorage({})
//     function fileFilter(req, file, cb) {
//         console.log({file});
//         if (!customValidation.includes(file.mimetype)) {
//             cb("In-valid Format", false)
//         } else {
//             cb(null, true)

//         }
//     }
//     const upload = multer({ fileFilter, storage: storage })
//     return upload
// }



import multer from 'multer'
import { nanoid } from 'nanoid'
//

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const pathName = {
    userProfile: 'user/profile',
    userProfileCover: 'user/profile/cover',
    notePic:'user/profile/note',
    pdf:'user/attachment'
}



// export const validationTypes = {
//     image: ['image/png', 'image/jpeg', 'image/jif'],
//     pdf:['application/pdf']
// }

export const HME = (redirectPath) => {
        return (err, req, res, next) => {
            if (err) {
                req.flash('multerErr', err)
                res.redirect(redirectPath)
            } else {
                next()
            }
    
        }
    }


export function myMulter(customValidation, customPath = 'general',isFileRequired=true) {
    if (!customValidation) {
        customValidation = validationTypes.image
    }
    const fullPath = path.join(__dirname, `../../uploads/${customPath}`)
    console.log(fullPath);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true })
    }
    const storage = multer.diskStorage({

        destination: function (req, file, cb) {
            cb(null, `uploads/${customPath}`)
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = nanoid()
            // console.log({ filename: uniqueSuffix + file.originalname });
            cb(null, uniqueSuffix + file.originalname)
        },

    })

    function fileFilter(req, file, cb) {
        console.log({ file });
        if (!file && !isFileRequired) return cb(null, true);
        if (!customValidation.includes(file.mimetype)) {
            
            return cb('In-valid Format', false)

        }

        else {
            cb(null, true)
        }
    }
    const maxSize = 25 * 1024

    const upload = multer({  fileFilter, limits: maxSize, storage })
    return upload
}