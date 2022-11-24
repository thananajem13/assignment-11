const dataMethod = ['body', 'params', 'query','file']


export const validation = (schema, redirectPath) => {

    return (req, res, next) => {
        const validationArr = []
        const validationMessage = []

        for (const key of dataMethod) {
            if (schema[key]) {
                const validationResult = schema[key].validate(req[key], { abortEarly: false })
                console.log({validationResult}); 
                if (validationResult.error) {
                    
                    // console.log({va:validationResult.error.details});
                    for (const ele of validationResult.error.details) {
                        console.log({ele});
                        validationArr.push(ele.context.label)
                        validationMessage.push(ele.message)

                    }
                }
                console.log({validationArr});
            }

        }

        if (validationArr.length) {
            req.flash('oldInputs', req.body)
            req.flash('validationErr', validationArr)
            req.flash('validationMessage', validationMessage)
            // const oldInput = req.flash('oldInputs')
            // console.log({oldInput});
            res.redirect(redirectPath)
        } else {
            next()
        }
    }


}