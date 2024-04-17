import multer from "multer";
import { randomUUID } from "crypto"
import { extname } from "path"
import { Express } from "express";

interface CustomFile extends Express.Multer.File{
    meta : Record<string, any>
}

const storage = multer.diskStorage({
    "destination" : process.env.TMP_FOLDER,
    async filename(req, file : CustomFile, callback) {
        const filename = `${randomUUID()}-${Date.now()}${extname(file.originalname)}`

        if(req.body.meta){
            try{
                file.meta = JSON.parse(req.body.meta)
            }catch(err){}
        }

        callback(null, filename)
    }, 
})

export const upload = multer({storage})