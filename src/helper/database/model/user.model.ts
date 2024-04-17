import { Schema, model } from "mongoose";
import { IUser } from "../../../type";
import * as bcrypt from "bcrypt"

const UserSchema = new Schema<IUser>({
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    access : {
        user : {
            view : {
                type : Boolean,
                default : true
            },
            create : Boolean,
            update : Boolean,
            delete : Boolean
        },
        file : {
            upload : Boolean,
            delete : Boolean,
            update : Boolean,
            download : {
                type : Boolean,
                default : true
            },
            view : {
                type : Boolean,
                default : true
            }
        }
    },
    owner : Boolean,
    isDeleted : {
        type : Boolean,
        default : false
    }
}, {
    timestamps : true
})

UserSchema.pre(
    "save",
    async function(next){
        
        if(!this.isModified("password")) return next()

        const salt = bcrypt.genSaltSync(parseInt(process.env.BCRYPT_ROUND ?? "10"))
        const hashedPassword = bcrypt.hashSync(this.password, salt)
        this.password = hashedPassword

        return next()

    }
)

const UserModel = model('User', UserSchema)

export default UserModel