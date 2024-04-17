import { NextFunction, Request, Response } from "express";
import mongoose, { ObjectId } from "mongoose";
import * as fs from "fs"
import { initializeBucket, getBucket as getBuckets } from "../../helper/database/mongo/bucket.mongodb";
import BadRequest from "../../helper/error/BadRequest";
import logger from "../../helper/logger.helper";
import FileNotFound from "../../helper/error/FileNotFound";
import HttpError from "../../helper/error/HttpError";
import { client } from "../../helper/database/mongo/connection.mongodb";

export async function getBucket(
    req : Request, 
    res : Response, 
    next : NextFunction
){
    const cols = await getBuckets()
    return res.json({data : cols})
}

export async function getBucketFile(
    req : Request,
    res : Response,
    next : NextFunction
){
    const { bucket : bucketName } = req.params
    
    const filter : Record<string, any> = req.query.filter ? req.query.filter as any : {}
    const limit : number = req.query.limit ? parseInt(req.query.limit as string) : 25
    const sort = req.query.sort ? req.query.sort : {_id : -1}
    const page : number = req.query.page ? parseInt(req.query.page as string) : 1

    const col = await client.db().collection(`${bucketName}.files`)

    const files = await col
        .find(
            filter as Object, 
            {
                sort : sort as any,
                limit
            })
        .skip((page - 1) * limit)
        .toArray()
    
    const totalFiles = await col.countDocuments(filter as Object)
    const perPage = limit

    return res.json({
        data : files,
        pagination : {
            total : totalFiles,
            perPage,
            // lastCursor : lastFile._id.toString()
        }
    })
}

interface CustomFile extends Express.Multer.File{
    meta : Record<string, any>
}
export async function upload(
    req : Request, 
    res : Response, 
    next : NextFunction
){

    const { bucket : bucketName } = req.params

    if(!req.file){
        const err = new BadRequest("Field 'file' not found")
        return next(err)
    }

    const file = req.file as CustomFile

    const bucket = await initializeBucket({bucketName})

    const {path, fieldname, ...f} = file
    const id = new mongoose.mongo.ObjectId()

    const bucketStream = bucket.openUploadStreamWithId(
        id,
        f.filename,
        {
            metadata : {
                originalName : f.originalname,
                mimetype : f.mimetype,
                custom : f.meta,
            }
        }
    )

    fs.createReadStream(path)
        .pipe(bucketStream)
    
    res.json({
        data : {
            id,
            ...f
        },
        message : "Successfully upload file",
    })

    bucketStream.once(
        "finish",
        () => {
            res.end()
            fs.unlink(path, (err) => {
                if(err){
                    const error = {
                        name : err.name,
                        errno : err.errno,
                        path : err.path,
                        message : err.message,
                        stack : err.stack,
                        syscall : err.syscall
                    }
                    logger.error(
                        "\n" +
                        JSON.stringify(error, null, 2) +
                        " >>> EOF"
                    )
                }
            })
        }
    )

}

export async function download(
    req : Request,
    res : Response,
    next : NextFunction
){
    const {filename, bucket : bucketName} = req.params
    
    const bucket = await initializeBucket({bucketName})
    
    const stream = bucket.openDownloadStreamByName(
        filename as string
    )

    stream.once(
        "error",
        err => {
            if(err.message.includes("FileNotFound")){
                const error = new FileNotFound(err.message)
                next(error)
            }else{
                const error = new HttpError(err.message)
                next(error)
            }
        }
    )

    stream.pipe(res)

    stream.once(
        "end",
        () => {
            res.end()
        }
    )

}