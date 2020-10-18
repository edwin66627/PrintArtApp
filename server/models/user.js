const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")

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
        transform: (doc, { _id, name, email, token }) => ({ _id, name, email, token })
    }
})

UserSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toHexString() },
        process.env.JWT_SECRET).toString();
    this.token = token;
    await this.save()
    return token
};

UserSchema.statics.findUserByToken = async function (token) {
    try {
        //Deconstructing payload to get just the '_id'
        const { _id } = jwt.verify(token, process.env.JWT_SECRET)
        //Mongoose method to find a record by passing an object with certain conditions we want to match on
        return this.findOne({ _id, token })
    } catch (err) {
        throw err
    }

}

//@argument 'user' tells mongoose what model function this pre hook should be applied to
UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        try {
            this.password = await bcrypt.hash(this.password, 8)
            next()
        } catch (err) {
            next(err)
        }
    } else {
        next()
    }
})

module.exports = mongoose.model('User', UserSchema)