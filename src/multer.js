
const express = require('express')
const app = express()
const port = 4000
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploadsFolder')// in cb, null telss there is no error, saves the in given folder name 
    }, // "abc.test.xyz.doc" ---- split function ---- split('.') -> ["abc", "test", "xyz", "doc"]
      // "abc.test.xyz.doc" ---- split function ---- split('t') -> ["abc.", "es", ".xyz.doc"]
    filename: (req, file, cb) => {
        const fileNameSplit = file.originalname.split('.')
        const fileExtension = fileNameSplit[fileNameSplit.length - 1]//get file extension from ---fileNameSplit[2-1]
        cb(null, Date.now() + '-' + Math.ceil(Math.random() * 1000) + '.' + fileExtension)
    }
})

const fileUpload = multer({
    //dest: 'uploadsFolder' /*folder name on the server */,
    storage,
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

app.post('/fileuploads', fileUpload.single('fileUpload'), (req, res) => {
    res.send("file uploaded suuessfully!")
}, (error, req, res, next) => { //error will be fall into the last callback of our route    
    res.status(400).send({ error: error.message })
})

app.use(express.json())
app.listen(5000, () => {
 console.log("app is listening to port!")
})