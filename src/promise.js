//  const addNumber= (a, b) => {
//     const fail = Math.floor(Math.random() * 4) === 3
//     return new Promise((res, rej) => {
//         setTimeout(() => {
//             if(!fail){
//                 res(a + b)
//             }
//             else{
//                 rej("Rejected!")
//             }
//         }, 2000)
//     })
// }

// // addNumber(2, 4)
// //     .then((result1) => {
// //         console.log(result1)

// //         addNumber(4, result1)
// //             .then((result2) => {
// //                 console.log(result2)

// //                 addNumber(4, result2)
// //                 .then((finalResult) => {
// //                     console.log(finalResult)
// //                 })
// //                 .catch(e => console.log(e))
// //             })
// //             .catch(e => console.log(e))
// //     })
// //     .catch(e => console.log(e))


// // ------------------- PROMISE CHAINING  ----------------------
// addNumber(2, 4)
//     .then((result1) => {
//         console.log(result1)

//         return addNumber(4, result1)
//     })
//     .then((result2) => {
//         console.log(result2)

//         return addNumber(4, result2)
//     })
//     .then((finalResult) => {
//         console.log(finalResult)
//     })
//     .catch(e => console.log(e))


// ------------------- ASYNC/AWAIT  ----------------------

// const sum = async (a, b) => {
//     const result1 = await addNumber(a, b)
//     const result2 = await addNumber(result1, 2)
//     const finalResult = await addNumber(result2, 2)

//     //console.log(finalresult)
//     return finalResult
// }

// sum(2, 2).then(r => console.log(r)).catch(e => console.log(e))


// ----------------------------xxx------------------------

require('./db')
const Profile = require('./models/profile')

// Profile.findByIdAndUpdate('5cee2a3bbe4c4e3b245f5822', {
//     graduate: true
// })
// .then(res => {
//     console.log(res)

//     return Profile.countDocuments({
//         graduate: true
//     })
// })
// .then((count => console.log(count)))
// .catch(e => console.log(e))


// -------------------- ASYNC/AWAIT --------------------

const updateAndCount = async (id, criteria) => {
    try{
        //await Profile.findByIdAndUpdate(id, criteria)
        const result = await Profile.findByIdAndUpdate(id, criteria)
        if(!result){
            throw Error("Profile not found!")
        }
        const count = await Profile.countDocuments(criteria)
        //console.log(count)
        console.log(result, count)
    }
    catch(e){
        console.log("error.....", e)
    }

}

updateAndCount('5cee2a3bbe4c4e3b245f5822', { graduate: true })