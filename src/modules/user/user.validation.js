import joi from 'joi' 
 
export const updateProfile = {
     
    body: joi.object().required().keys({
        name: joi.string().required().messages({
            "string.empty": "fill name filed, shouldn't be empty",
            "string.base": "name must be a string",
            "any.required": "name is required"
        }),
        email: joi.string().email().required().messages({
            "string.empty": "fill email filed, shouldn't be empty",
            "string.base": "email must be a string",
            "any.required": "email is required"
        }),
        password:joi.string().allow('').pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)) ,
        phone: joi.string().allow('').pattern(new RegExp(/[0-9]{10,14}/))
    },
    
    )
}
 

export const getUsers = {
    params: joi.object().required().keys({
        size: joi.number().positive().messages({
            "number.positive": "size must be positive",
            "number.base": "size must be a number"
        }),
        page: joi.number().positive().messages({
            "number.positive": "page must be positive",
            "number.base": "page must be a number"
        }),
    })
}
export const getUserNotes = {
    params: joi.object().required().keys({
        size: joi.number().positive().messages({
            "number.positive": "size must be positive",
            "number.base": "size must be a number"
        }),
        page: joi.number().positive().messages({
            "number.positive": "page must be positive",
            "number.base": "page must be a number"
        }),
        id:joi.string().required().min(24).max(24)
    })
}