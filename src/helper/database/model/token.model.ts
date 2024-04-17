import { Schema, SchemaTypes, model } from "mongoose";

const TokenSchema = new Schema({
    user : {
        type : SchemaTypes.ObjectId,
        required : true,
        ref : 'User'
    },
    title : {
        type : String,
        required : true,
        unique : true
    },
    description : String,
    token : {
        type : String,
        required : true,
        unique : true
    }
},{
    timestamps : true
})

const TokenModel = model('Token', TokenSchema)

export default TokenModel