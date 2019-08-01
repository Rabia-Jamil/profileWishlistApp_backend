const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const WishList = require('./wishlist')

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    age: {
        type: Number,
        min: 0,
        // validate(value){
        //     if(value < 0){
        //         throw new Error("Age cannot be negative!")
        //     }
        // }
    },
    graduate: {
        type: Boolean,
        required: true,
        default: true,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Incorrect email!")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password'))
            {
                throw Error('Password cannot contain "password"!')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
    avatar: {
        type: Buffer,
    }

}, { 
    toObject: { virtuals: true }, 
    timestamps: true,
   })

profileSchema.virtual('wishList', { //wishList is the name jis hum aagay further isko refer krenge
    ref: 'WishList', //name of the slave schema
    localField: '_id', //master schema's field        -- localField and foreignField will get matched and then bring the records after matching
    foreignField: 'wishedBy' //slave schema's field
})

profileSchema.pre('save', async function(next){
    const profile = this // we will not use the arrow function when we use "this" because it will change the context of "this" in arrow function
   // console.log(profile.password, "pre password")
    if(profile.isModified('password')){
        profile.password = await bcrypt.hash(profile.password, 8) // 8 is the optimal no. of cycles for hashing
       // console.log(profile.password, "hashed password")
    }
    next() //like we do in redux. we call next function. this next function works for the next middleware if there is any otherwise it will save the record 
})

profileSchema.pre('remove', async function(next){
    const profile = this // we will not use the arrow function when we use "this" because it will change the context of "this" in arrow function
    await WishList.deleteMany({
        wishedBy: profile._id
    })
    next() //like we do in redux. we call next function. this next function works for the next middleware if there is any otherwise it will save the record 
})

profileSchema.statics.findByCredentials = async ( email, password ) => {
    const profile = await Profiles.findOne({ email })
    if(!profile){
        throw new Error("User does not exist!")
    }

    const isMatch = await bcrypt.compare(password, profile.password)

    if(!isMatch){
        throw new Error("Wrong credentials!")
    }

    return profile
}

profileSchema.methods.generateAuthToken = async function() {
    const profile = this //we need it with every record so we used "this", and when we use "this" we don't create arrow function. "this" belongs to that particular record on which the function operates.
    const token = jwt.sign({ _id: profile._id.toString() }, process.env.JWT_SECRET)
    profile.tokens = profile.tokens.concat({ token }) //{( token: token }) //the token we generated above, we concat it as an object in the array
    await profile.save()

    return token //return token because we have to send the token to the client
}

profileSchema.methods.toJSON = function() {
    const profile = this
    const publicProfileData = profile.toObject() //toObject is like toString, it will convert profile into object. The profile is not already in the object form, it is in JSON format, therefore we first convert it into object so that we can access it via this.key.value
    //we are making a copy of profile into a new variable called publicProfileData
    delete publicProfileData.password
    delete publicProfileData.tokens
    delete publicProfileData.avatar

    console.log(publicProfileData)
    return publicProfileData
}

profileSchema.statics.toJSON = function(records) { //we didn't make it a simple function instead we made it using statics because we'll not need to import/export the function to use it, we can use it simply because we'll get the access of the function where this schema is already called
    const profiles = records
    const publicProfileFields = profiles.map((p) => {
        const obj = p.toObject()
        delete obj.password
        delete obj.tokens
        delete obj.avatar
        return obj
    }) //map will return an array and we also have an array of profiles(array of objects) so no problem
    return publicProfileFields
}

// profileSchema.methods.sendPublicData = function() {
//     const profile = this
//     const publicProfileData = profile.map((p) => {
//         const obj = p.toObject() //toObject is like toString, it will convert profile into object. The profile is not already in the object form, it is in JSON format, therefore we first convert it into object so that we can access it via this.key.value
//         //we are making a copy of profile into a new variable called publicProfileData
//         delete obj.password
//         delete obj.tokens
//         console.log(publicProfileData)
//         return obj
//     })
//     console.log(publicProfileData)
//     return publicProfileData
// }

// profileSchema.statics.sendPublicDataOnly = function() {
//     const profile = this
//     const publicProfileData = profile.toObject() //toObject is like toString, it will convert profile into object. The profile is not already in the object form, it is in JSON format, therefore we first convert it into object so that we can access it via this.key.value
//     //we are making a copy of profile into a new variable called publicProfileData
//     delete publicProfileData.password
//     delete publicProfileData.tokens

//     console.log(publicProfileData)
//     return publicProfileData
// }

const Profiles = mongoose.model('Profiles', profileSchema)

module.exports = Profiles