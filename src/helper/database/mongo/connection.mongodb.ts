import mongoose from "mongoose";
import logger from "../../logger.helper";

export const connection = mongoose.createConnection(process.env.MONGODB_URI as string)

export const client = connection.getClient()

client.on(
    "connectionReady", 
    () => {
        logger.verbose("Connected to database")
    }
)

client.on(
    "connectionClosed",
    (e) => {
        logger.error(
            `Disconnected from database : ${e.reason}`
        )
    }
)

client.on(
    "error",
    (err) => {
        logger.error(
            `Error when connecting to database : ${err.message}`
        )
    }
)