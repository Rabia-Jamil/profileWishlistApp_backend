require('./db')
const express = require('express')
const profileRoutes = require('./routes/profile')
const wishRoutes = require('./routes/wishlist')

const app = express()
const port = process.env.PORT

// we will not use this approach to authenticate token because it will be for login & sigup routes
// app.use((req, res, next) => {
//     //res.send("Sorry site is under maintenance! Please try again later!")
//     res.status(500)
//     res.status(500)//.send()  //this .send() works as return statement and will not execute the next lines
//     next()
// }) 


// app.use((req, res, next) => {
//     if(req.method === 'DELETE'){
//         res.send('DELETE requests are disabled!')
//     }
//     else{
//         next()
//     }
// })

app.use(express.json()) // this will tell express that the receiving data will be in json format 
app.use(profileRoutes)
app.use(wishRoutes)

app.listen(port, () => {
    console.log("app listening to port....")
})
// const newRec = Profiles({
//     name: "Rabia Jamil",
//     age: 23,
//     graduate: true,
//     email: "rabiajamil@gmail.com",
// })

// newRec.save()
//     .then(data => console.log(data))
//     .catch(err => console.log(err))