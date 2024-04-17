import UserModel from "./database/model/user.model";
import { randomBytes } from "crypto"
import logger from "./logger.helper";

const password = randomBytes(8).toString("base64")
const rootUser = new UserModel({
    username : "root",
    password,
    access : {
        "user" : {
            "create" : true,
            "delete" : true,
            "update" : true,
            "view" : true
        },
        "file" : {
            "upload" : true,
            "update" : true,
            "download" : true,
            "delete" : true,
            "view" : true
        }
    },
    owner : true
})

export async function seed(){
    const isRootUserExist = await UserModel.exists({username : rootUser.username})

    if(isRootUserExist) {
        logger.verbose("root user is exist")
        return
    }

    logger.verbose("seeding...")
    logger.verbose("creating new root user...")
    await rootUser.save()
        .then(
            () => logger.verbose(`successfully create new root user, default password is : ${password}`)
        )

}