const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const UserSchema = mongoose.Schema({
    name: { type: String, required: true, minlength: 2, trim: true },
    email: {
        type: String, required: true, unique: true, trim: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: { type: String, required: true, minlength: 6, trim: true },
    token: {
        type: String
    }
}, {
    toJSON: {
        //'doc' is the full model document and 'ret' is plain object representation of that doc
        //Destructuring 'ret' to exclude fields in json responses like 'password'
        transform: (doc, { _id, name, email }) => ({ _id, name, email })
    }
})

UserSchema.methods.generateAuthtoken = async function () {
    const token = jwt.sign({ _id: this._id.toHexString() },
        process.env.JWT_SECRET).toString();
    this.token = token;
    await this.save()
    return token
};

module.exports = mongoose.model('User', UserSchema)