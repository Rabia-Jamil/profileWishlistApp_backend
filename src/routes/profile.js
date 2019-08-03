const express = require('express')
const router = express.Router()
const Profiles = require("../models/profile")
const auth = require('../middlewares/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendGoodByeEmail } = require('../emails/profiles')

// app.post('/profiles', (req, res) => {
//     const profile = Profiles(req.body)

//     profile.save().then(() => {
//         res.send(profile) // server will send the saved data(in db) to the client.
//     }).catch((e) => {
//         res.status(400)
//         res.send(e)
//     })
// })

router.post('/profiles', async(req, res) => {
    try{
        const profile = await Profiles(req.body).save()
        //await profile.save()
        const token = await profile.generateAuthToken()
        sendWelcomeEmail(profile.email, profile.name)
        res.send({ profile, token }) // server will send the saved data(in db) to the client.
    }
    catch(e) {
        res.status(400)
        res.send(e)
    }
})

// app.get("/profiles", (req, res) => {
//     Profiles.find({})
//      .then(profiles => res.send(profiles))
//      .catch(e => res.status(500).send(e))
// })

router.get("/profiles", auth, async (req, res) => {
    try{
        const profiles = await Profiles.find({})
        // profiles.methods & Profiles.statics ------ wala call krenge
        if(!profiles){
            res.status(404).send("Record not found!")
        }

       // const publicData = Profiles.sendPublicDataOnly(profiles)
        //const publicData = profiles.sendPublicData()
        res.send(profiles)
    }

     catch(e) {
         res.status(500).send(e)
     }
})

// app.get("/profiles/:id", (req, res) => {
//     const id = req.params.id
//     Profiles.findById(id)
//      .then(profile => {
//          if(!profile){
//              res.status(404).send("Record not found!")
//          }
//          res.send(profile)
//         })
//      .catch(e => res.status(500).send)
// })


// -------------------- ASYNC/AWAIT --------------------
router.get("/profiles/myprofile", auth, async (req, res) => {
   // const id = req.params.id

    try{
        //const profile = await Profiles.findById(id)

        const profile = req.profile//.sendPublicDataOnly()

        // if(profile._id.toString() !== id){
        //     res.status(404).send("Record not found!")
        // }
        await profile.populate('wishList').execPopulate()
        res.send(profile)
    }

    catch(e) {
        res.status(500).send()
    }
})

// router.patch('/profiles/:id', async(req, res) => {
//     const fieldsToUpdate = Object.keys(req.body)
//     const fieldsInModel = ['name', 'age', 'graduate', 'email']
//     const isUpdateAllowed = fieldsToUpdate.every((field) => fieldsInModel.includes(field))

//     if(!isUpdateAllowed){
//         return res.status(400).send({ error: 'Invalid field!'})
//     }

//     try{
//         const profile = await Profiles.findByIdAndUpdate(req.params.id, req.body, {
//             new: true, runValidators: true
//         })
//         if(!profile){
//             return res.status(404).send("Record not found!")
//         }
//         res.send(profile)
//     }
//     catch(e) {
//         res.status(400).send(e)
//     }
// })

// ------------------ after adding password field ----------------------
router.patch('/profiles/myprofile', auth, async(req, res) => { //ab ye jo auth ka middleware chalega wo is function mein hum ko jo req bhej raha hai us req mein profile hai jab hamare paas profile hai tou we don't need to find it again
    const changedProfile = req.body
    const fieldsToUpdate = Object.keys(changedProfile)
    const fieldsInModel = ['name', 'age', 'graduate', 'email', 'password']
    const isUpdateAllowed = fieldsToUpdate.every((field) => fieldsInModel.includes(field))

    if(!isUpdateAllowed){
        return res.status(400).send({ error: 'Invalid field!'})
    }

    try{
        //const profile = await Profiles.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        
       /* const profile = await Profiles.findById(req.params.id)

        if(!profile){
            return res.status(404).send("Record not found!")
        } */ //pehle hum profile la rahay thay findById se. Ab hum ko findById krne ki zarrorat nhi kyn k authentication tou auth wese hi bhej raha hai

        // profile = { "_id":"5cee2a3bbe4c4e3b245f5822",
        //   "graduate":true,
        //   "name":"rabiaJamil",
        //   "age":23,
        //   "email":"rabia@gmail.com",
        //   "password": "123"
        //   "__v":0
        // }

        // changedProfile = {
        //     "age": 23,
        //     "email": "rjamil@gmail.com"
        //     "password": "1234"
        // }

        const profile = profile.req
        Object.assign(profile, changedProfile)
        await profile.save()
        
        res.send(profile)
    }
    catch(e) {
        res.status(400).send(e)
    }
})

// router.delete('/profiles/:id', async(req, res) => {
//     try{
//         const profile = await Profiles.findByIdAndDelete(req.params.id)
//         if(!profile){
//             res.status(404).send("Profile not found!")
//         }
//         res.send(profile) // if no profile found then it will return empty/blank
//     }
//     catch(e){
//         res.status(500).send("Error occurred. Please try again later!")
//     }
// })

router.delete('/profiles/myprofile', auth, async(req, res) => {
    try{
        // const profile = await Profiles.findByIdAndDelete(req.profile._id)
        // if(!profile){
        //     res.status(404).send("profile not found")
        // }
        //await req.profile.populate('wishList').execPopulate()
        await req.profile.remove()
        sendGoodByeEmail(req.profile.email, req.profile.name)
        res.send(req.profile)
    }
    catch(e){
        res.status(500).send("Internal server error. Please try again later!")
    }
})


router.post('/profiles/login', async (req, res) => {
    try{
        const profile = await Profiles.findByCredentials(req.body.email, req.body.password)
        
        const token = await profile.generateAuthToken()

        const publicData = profile.sendPublicDataOnly()
        res.send({ profile /*publicData*/, token })
    }
    catch(e){
        res.status(400).send("Unable to login")
    }
})

router.post('/profiles/logout', auth, async(req, res) => {
    try{
        const { profile, token } = req

        profile.tokens = profile.tokens.filter((t) => t.token !== token)
        await profile.save()

        res.send("logged out!")
    }
    catch(e){
        res.status(400).send()
    }
})



// -------- Image upload ----------------- //

const fileUpload = multer({
    //dest: 'uploadsFolder' /*folder name on the server */,
    //storage,
    limits: { //limits is in bytes
        fileSize: 1000000 //for not more than 1MB
    },
    fileFilter(req, file, cb) {
        //if(!file.originalname.endsWith('.jpg')) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ //we've used regular expression to allow for multiple file extensions
            return cb(new Error('Please upload a jpg file!'))
        }

        cb(undefined, true) //undefined means no error & true is for carry on with file upload and false is for cancel file upload
    }
})


router.post('/profiles/uploadfile', auth, fileUpload.single('avatar'), async(req, res) => {
    // req.profile.avatar /* avatar will be the key of profile object like other keys e.g. name, age, email */= req.file.buffer // this will be the value of that key. Jab bhi hum upload krte hain koi file tou req.body k bjae req.file use krte hain
    // await req.profile.save()

    const buffer = await sharp(req.file.buffer).resize({ width: 200, height: 200}).png().toBuffer()
    req.profile.avatar = buffer
    //req.profile.avatar = req.file.buffer
    await req.profile.save()

    res.send("Profile picture has been uploaded successfully!")
},  (error, req, res, next) => { //error will be fall into the last callback of our route    
    res.status(400).send({ error: error.message })
})

// ------------- To Delete an Image ----------------

router.delete('/profiles/myavatar', auth, async(req, res) => {
    req.profile.avatar = undefined //here we set profile.avatar equals to undefined so the avatar value in the db will be replaced by null or undefined, hence avatar deleted
    await req.profile.save()
    res.send("Avatar has been deleted successfully!")
})

// ----------- To Retreive Image from db ---------
router.get('/profiles/myprofile/avatar', auth, async(req, res) => {
    try{
        const profile = req.profile
        if(!profile.avatar){
            throw new Error("No avatar found!")
        }


        res.set('Content-Type', 'image/png')// this thing will tell the client side browser that the data you are going to get is/ getting is an image.jpg file, normally hamara Content-Type JSON hota hai
        res.send(profile.avatar)
    }
    catch(e){

    }
})

module.exports = router