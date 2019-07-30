const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const url = 'mongodb://127.0.0.1:27017'
const databaseName = 'dbpractice'

MongoClient.connect(url, {
    useNewUrlParser: true
}, (error, client) => {
    if(error){
       return console.log("error connecting db")
    }
    console.log("db connected!")

    const db = client.db(databaseName) //create a db

//     db.collection('profiles').insertMany([{
//         name: "Rabia",
//         email: "rabia@gmail.com"
//     },
//     {
//         name: "Aaminah",
//         email: "aaminah@gmail.com"
//     },
// ], (error, response) => {
//     if(error){
//         console.log("error inserting data")
//     }
//     console.log(response.ops)
// }) //create a collection and insert one record/document in it

// db.collection('profiles').findOne({
//     //email: "rabia@gmail.com"
//       _id: ObjectId("5cd07801fab13928c8cac087")
// }, (error, data) => {
//     if(error){
//         console.log("error retrieving data")
//     }
//     console.log(data)
// })

//     client.close()
// })

// db.collection('profiles').find({ //find function returns a cursor
//     email: "rabia@gmail.com"
// }).toArray((error, data) => console.log(data))
// //count((error, count) => console.log(count))

//     client.close()
// })


/*
{
    name: "Rabia",
    age: 23,
    education: {
        mostRecent: "B.E",
        recent: "Intermediate",
        gpa: [4, 3, 2],
    }
} 
*/

// db.collection('profiles').updateOne(
//     { email: "rabia@gmail.com" },
//    // { $set: {name: "Rabia Jamil"} }
//    //{ $inc: {"education.gpa.1": "Rabia Jamil"} },
//    { $inc: {age: 2} }
// ).then((data) => console.log(data)).catch(e => console.log(e))
//     client.close()
// })

// db.collection('profiles').updateMany(
//     { email: "rabia@gmail.com" },
//    // { $set: {name: "Rabia Jamil"} }
//    //{ $inc: {"education.gpa.1": "Rabia Jamil"} },
//    { $inc: {age: -23} }
// ).then((data) => console.log(data)).catch(e => console.log(e))
//     client.close()
// })

// db.collection('profiles').deleteOne(
//     {email: "rabia@gmail.com"}
// )
// .then(result => console.log(result))
// .catch(err => console.log(err))

db.collection('profiles').deleteMany(
    {email: "rabia@gmail.com"}
)
.then(result => console.log(result))
.catch(err => console.log(err))


})

// require('./db')

// const Profiles = require('./models/profile')

// const newRec = Profiles({
//     name: "Fehmeeda",
//     age: 23,
//     graduate: "true",
//     email: "fehmeedajamil251@gmail.com",
// })

// newRec.save()
//     .then((data) => console.log(data))
//     .catch((err) => console.log(err))