const mongoose = require('mongoose')

const wishListSchema = new mongoose.Schema({
    wish: {
        type: String,
        required: true,
    },

    wishedBy: {
        type: mongoose.Schema.Types.ObjectId, //db saves ObjectId not the simple string.  
        required: true,
        ref: 'Profiles', //this is reference from another table by telling the name of the schema
    },

    status: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
})

const WishList = mongoose.model('WishList', wishListSchema)

module.exports = WishList