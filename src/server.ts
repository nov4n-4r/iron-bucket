import {config} from "dotenv"
import path from "path"

config({
    path : path.join(
        process.cwd(),
        ".env"
    ),
    debug : true
})

if(process.env.NODE_ENV){
    config({
        path : path.join(
            process.cwd(),
            `.env.${process.env.NODE_ENV}`
        ),
        debug : process.env.NODE_ENV !== "development"
    })
}

import bodyParser from "body-parser"
import express from "express"
import indexRouter from "./app/bucket/bucket.route"
import logger from "./helper/logger.helper"
import "./helper/database/mongo/connection.mongodb"
import { client } from "./helper/database/mongo/connection.mongodb"
import errorHandler from "./middleware/errorHandler.middleware"
import authRouter from "./app/auth/auth.route"
import mongoose from "mongoose"
import { seed } from "./helper/seed.helper"

const app = express()

app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())

app.use("/", indexRouter)
app.use("/auth", authRouter)

app.use(errorHandler)

app.listen(
    process.env.PORT,
    () => {
        client.connect()
            .then(
                () => {
                    mongoose.connection.setClient(client)
                    seed()
                }
            )
        logger.verbose(`App is running on port : ${process.env.PORT}`)
    }
)