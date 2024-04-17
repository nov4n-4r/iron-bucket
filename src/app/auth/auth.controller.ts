import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken"
import { GenerateTokenBody, IUserJWTParsed, SerializedUserExpressRequest } from "../../type";
import { compareAccess } from "../../helper/util.helper";
import UserModel from "../../helper/database/model/user.model";
import Forbidden from "../../helper/error/Forbidden";
import mongoose from "mongoose";
import TokenModel from "../../helper/database/model/token.model";
import BadRequest from "../../helper/error/BadRequest";
import NotFound from "../../helper/error/NotFound";

// generate token
// POST /auth/token
export async function generateToken(
    req : Request,
    res : Response,
    next : NextFunction
){
    try{
        
        const body = req.body as GenerateTokenBody
        const user = await UserModel.findOne({username : body.username})
        
        if(!user){
            const error = new Forbidden("Invalid username or password")
            return next(error)
        }
    
        // validate proposed access
        compareAccess(user, req.body.access)

        const payload : IUserJWTParsed = {
            _id : user._id,
            username : user.username,
            access : body.access
        }

        if(user.owner) payload.owner = user.owner

        const accessTokenId = new mongoose.mongo.ObjectId()
        const accessToken = await jwt.sign(
            payload, 
            process.env.ACCESS_TOKEN_SECRET as string,
            {
                jwtid : accessTokenId.toString(),
                issuer : "iron-bucket-system",
                subject : user.username
            }
        )

        const token = new TokenModel({
            _id : accessTokenId,
            user : user._id,
            title : body.title,
            description : body.description,
            token : accessToken
        })

        await token.save()

        return res.json({
            data : token.toObject({getters : false})
        })
    
    }catch(err){
    
        if(err instanceof mongoose.mongo.MongoServerError){
            if(err.code === 11000) return next(new BadRequest(err.message))
        }

        return next(err)
    
    }
}

// revoke or delete token
// DELETE /auth/token/:tokenId
export async function revokeTokenById(
    req : Request,
    res : Response,
    next : NextFunction
){
    
    try{

        const tokenId = req.params.tokenId as string
        const token = await TokenModel.findByIdAndDelete(tokenId)

        if(!token) return next(new NotFound("Token with the current id not found"))

        return res.json({
            data : token
        })
    
    }catch(err){
        return next(err)
    }

}

// updating token's data
// PUT /auth/token/:tokenId
export async function updateTokenById(
    req : Request,
    res : Response,
    next : NextFunction
){

    try{

        const body : Record<string, string> | {title? : string, description? : string} = req.body        

        const tokenId = req.params.tokenId as string
        
        const token = await TokenModel.findById(tokenId)
            .select("-token")
            .populate("user", "username isDeleted")

        if(!token) return next(new NotFound("Token with the current id not found"))

        Object.entries(body).map(
            ([key, value]) => {token.set(key, value)}
        )

        token.save()

        return res.json({
            data : token.toObject({getters : false})
        })

    }catch(err){
        return next(err)
    }

}

// view tokens by userId
// GET /auth/token
export async function viewToken(
    req : Request,
    res : Response,
    next : NextFunction
){
    try{
        
        const request = req as SerializedUserExpressRequest
        const tokens = await TokenModel
            .find({user : request.user._id}, "-token")
            .populate("user", "username isDeleted")

        return res.json({
            data : tokens
        })

    }catch(err){
        return next(err)
    }
}