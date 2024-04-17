import { NextFunction, Request, Response } from "express";
import { ValidationError } from "yup";
import logger from "../helper/logger.helper";
import BadRequest from "../helper/error/BadRequest";
import HttpError from "../helper/error/HttpError";

function errorHandler(
    err : Error,
    req : Request, 
    res : Response, 
    next : NextFunction
){
    
    if(process.env.NODE_ENV === "development"){
        logger.error(err.stack)
    }

    if(err instanceof ValidationError){
        return res
            .status(400)
            .json({
                error : {
                    name : err.name,
                    message: err.message
                }
            })
            .end()
    }

    if(err instanceof HttpError){
        logger.warn(err.message)
        const {statusCode, name, message} = err as HttpError
        return res
            .status(statusCode)
            .json({
                error : {
                    name,
                    message
                }
            })
    }

    logger.error(err.stack)
    return res
        .status(500)
        .end({
            error : {
                name : "InternalServerError",
                message : "Unknown error"
            }
        })

}

export default errorHandler