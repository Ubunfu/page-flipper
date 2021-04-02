const validator = require('validator')

async function findInvalidSignupFields(req) {
    const fName = req.body.firstName + ''
    const lName = req.body.lastName + ''
    const email = req.body.email + ''
    const pass = req.body.password + ''

    let invalidFields = []

    try {
        await validateName(fName)
    } catch (error) {
        console.log(`invalid first name`);
        invalidFields.push(`firstName`)
    }

    try {
        await validateName(lName)
    } catch (error) {
        console.log(`invalid last name`);
        invalidFields.push(`lastName`)
    }

    try {
        await validateEmail(email)
    } catch (error) {
        console.log(`invalid email address`);
        invalidFields.push(`email`)
    }

    try {
        await validatePassword(pass)
    } catch (error) {
        console.log(`invalid password`);
        invalidFields.push(`password`)
    }
    
    return invalidFields
}

async function validateName(name) {
    if (!validator.isAlpha(name)) {
        throw new Error('invalid_input')
    }
}

async function validateEmail(email) {
    if (!validator.isEmail(email)) {
        throw new Error('invalid_input')
    }
}

async function validatePassword(password) {
    // defaults need to be overridden
    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0
    })) {
        throw new Error('invalid_input')
    }
}

module.exports = {
    findInvalidSignupFields
}