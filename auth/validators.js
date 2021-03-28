const validator = require('validator')

async function findInvalidSignupFields(req) {
    const fName = req.body.firstName + ''
    const lName = req.body.lastName + ''
    const email = req.body.email + ''
    const pass = req.body.passwords + ''

    console.log(req.body);

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
    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1
    })) {
        throw new Error('invalid_input')
    }
}

module.exports = {
    findInvalidSignupFields
}