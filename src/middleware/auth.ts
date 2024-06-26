import { NextFunction, Request, Response } from "express";
import Forbidden from "../helper/error/Forbidden";
import { IUserJWTParsed, SerializedUserExpressRequest } from "../type";
import * as jwt from "jsonwebtoken"
import TokenModel from "../helper/database/model/token.model";
import { getValueByDotNotation } from "../helper/util.helper";
import Unauthenticated from "../helper/error/Unauthorized";

/** 
 * this middleware used to verify and serialize jwt from authorization header 
 */
export async function tokenRequired(
    req : Request,
    res : Response,
    next : NextFunction
){

    if(!req.headers.authorization){
        return next(new Forbidden("Unauthenticated"))
    }

    const [type, token] = req.headers.authorization.split(" ") as [string?, string?]

    if(type !== "Bearer" || !token){
        return next(new Forbidden("Authentication error, invalid token"))
    }

    const isTokenValid = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)

    if(!isTokenValid) return next(new Forbidden("Authentication error, invalid token"))

    const isTokenExist = await TokenModel.exists({token})

    if(!isTokenExist) return next(new Forbidden("Authentication error, invalid token"))

    const payload = isTokenValid as IUserJWTParsed

    const clonedReq = req as SerializedUserExpressRequest
    clonedReq.user = payload
    req = clonedReq

    return next()

}

/**
 * 
 * @param path 
 * this middleware should be used after tokenRequired() middleware
 */
export function requirePermission(path : string){
    
    return async function (
        req : Request,
        res : Response,
        next : NextFunction
    ){
        

        const request = req as SerializedUserExpressRequest
        
        if(!request.user){
            return next(new Unauthenticated("Authentication error, user not found"))
        }

        const grant = getValueByDotNotation(request.user.access, path)

        if(!grant){
            return next(new Unauthenticated("Authentication error, user doesn't has permission to access this resource"))
        }

        return next()

    }
    
}