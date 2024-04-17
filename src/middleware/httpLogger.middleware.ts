import { NextFunction, Request, Response } from "express";
import logger from "../helper/logger.helper";
import { isObjectEmpty } from "../helper/util.helper";

const httpLogger = (
    req: Request,
    res: Response,
    next: NextFunction 
) => {

    const {headers, body, params, method, originalUrl } = req
    
    const metadata : any = {headers}

    if(!isObjectEmpty(body)) metadata.body = body
    if(!isObjectEmpty(params)) metadata.params = params

    logger.log({
        level : "http",
        message : `${method.toUpperCase()} ${originalUrl}`,
        metadata
    })

    return next()

}

export default httpLogger