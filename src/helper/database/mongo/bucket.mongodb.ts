import mongoose from "mongoose";
import { client, connection } from "./connection.mongodb";

export async function initializeBucket(options : mongoose.mongo.GridFSBucketOptions){
    return new mongoose.mongo.GridFSBucket(connection.db, options)
}

export async function getBucket(){
    const cols = await client.db().listCollections({}, {nameOnly : true}).toArray()
    .then(
        collections => collections.filter(
            col => col.name.includes(".files")
        )
    )
    .then(
        collections => collections.map(
            col => col.name.replace(".files", "")
        )
    )

    return cols
}