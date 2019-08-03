const express = require('express')
const WishList = require('../models/wishlist')
const routes = express.Router()
const auth = require('../middlewares/auth')

//create wish route
routes.post('/wishlist', auth, async(req, res) => {
    try{
        const wish = new WishList({
            ...req.body,
            wishedBy: req.profile._id
        })

        await wish.save()

        res.status(201).send(wish)
    }
    catch(e){
        res.status(400).send(e)
    }
})

routes.get('/wishlist/:id', auth, async(req, res) => {
    const _id = req.params.id
    try{
        //const wish = await WishList.findById(_id)
        const wish = await WishList.findOne({
            _id,
            wishedBy: req.profile._id
        })

        if(!wish){
            res.status(404).send("No wish list found!")
        }

        await wish.populate('wishedBy').execPopulate() //this will populate the 'wishedBy' field. 'wishedBy' field k reference ko wish mein
        res.send(wish)
        //console.log(wish)
    }
    catch(e){
        res.status(500).send(e)
    }
})

routes.get('/wishlist/', auth, async(req, res) => {
    try{
        // const wishList = await WishList.find({
        //     wishedBy: req.profile._id
        // })

        //const wishList = await req.profile.populate('wishList').execPopulate()

        const { status, limit, skip, sortField, order } = req.query //query string mein status bhej do
        console.log(typeof(status), status, "status")
        const match = {} //we give a match as object because of mongoose req  //initially match blank rakha taa k agr user ne status dia ho tou match kray na ho (means no criteria) tou saaray records(with both true & false) le aye
        //this is because query string value is string and in database we stored status as boolean
        if(status){
            match.status = (status) === 'true' //agr user ne status dia tou ya tou true de ga ya false de ga tou hum ne check kya agr true dia hai tou true se true compare kr k true return kre ga warna jo bhi ho wo false ajaega
        }

        const sort = {}
        if(sortField){
            sort[sortField] = (order === 'desc') ? -1 : 1 //we used square backets not the dot to refer the sort object's key "sortField" because hum ne field ka naam dynamic rakhna hai. ab aesa krne se jo iski value hogi wo as a field hojaegi
        }

        const wishList = await req.profile.populate({
            path: 'wishList', //we don't simply give the field name as string here
            match,
            options: {
                limit: parseInt(limit),
                skip: parseInt(skip),
                sort,
            }
        }).execPopulate()
        
        if(!wishList){
            res.status(404).send("No wish list found!")
        }
        res.send(wishList)
    }
    catch(e){
        res.status(500).send(e)
    }
})

routes.delete('/wishlist/:id', auth, async(req, res) => {
    try{
        const wish = await WishList.findByIdAndDelete({
            _id: req.params.id,
            wishedBy: req.profile._id
        })
        if(!wish){
            res.status(404).send("No wish found!")
        }
        res.send(wish)
    }
    catch(e){
        res.status(500).send()
    }
})

routes.patch('/wishlist/:id', auth, async(req, res) => {
    const modifiedWish = req.body
    const fieldsToUpdate = Object.keys(modifiedWish)
    const fieldsInModel = ['wish', 'status']
    const isUpdateAllowed = fieldsToUpdate.every((field) => fieldsInModel.includes(field)) 
    if(!isUpdateAllowed){
        return res.status(400).send({ error: "Invalid fields!"})
    }
    try{
        const wish = await WishList.findOne({
            _id: req.params.id,
            wishedBy: req.profile._id
        })
        if(!wish){
            return res.status(404).send()
        }
        Object.assign(wish, modifiedWish)
        await wish.save()
        res.send(wish)
    }
    catch(e){
        res.status(400).send(e)
    }
})

module.exports = routes