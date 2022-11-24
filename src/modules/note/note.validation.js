import joi from 'joi'
export const getNotes = {
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
export const AddNote = {
    body: joi.object().required().keys({
        noteBody: joi.string().required(),
    }),
    params:joi.object().keys({
        id: joi.string().allow('').min(24).max(24)
    })
    // file: joi.object().keys({
    //     notePic: joi.string().allow(null),
    // })

}
export const deleteNote = {
    params:joi.object().required().keys({
        id: joi.string().required().min(24).max(24)
    })
}