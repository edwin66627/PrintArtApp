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
    },
    role: {
        type: String, enum: ["admin", "user"], default: "user"
    }
}, {
    toJSON: {
        //'doc' is the full model document and 'ret' is plain object representation of that doc
        //Destructuring 'ret' to exclude fields in json responses like 'password'
        transform: (doc, { _id, name, email, token, role }) => ({ _id, name, email, token, role })
    }
})

UserSchema.methods.generateAuthToken = async function () {
    //In case user logs in from browser, the token generated is stored in the model and if they
    //log in from another browser then they get the same token to not change the first one
    if (this.token) {
        return this.token
    }
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

UserSchema.pre("save", async function (next) {
    if (this.isModified("role") && this.role === 'admin') {
        const users = await this.constructor.find({ role: "admin" })
        if (users.length >= 1) {
            next(new Error("Only one admin user can be added"))
        } else {
            next()
        }
    } else {
        next()
    }
})

UserSchema.statics.findUserByCredentials = async function (email, password) {
    const user = await this.findOne({ email })
    if (!user) {
        throw {
            errors: {
                email: { message: 'User not found' }
            }
        }
    } else {
        let comparison = await bcrypt.compare(password, user.password)
        if (await bcrypt.compare(password, user.password)) {
            return user
        } else {
            throw {
                errors: {
                    email: { message: 'Incorrect password' }
                }
            }
        }
    }
}


module.exports = mongoose.model('User', UserSchema)