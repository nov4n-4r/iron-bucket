import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken"
import { GenerateTokenBody, IUserJWTParsed, SerializedBasicAuthExpressRequest } from "../../type";
import { compareAccess } from "../../helper/util.helper";
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
        
        const request = req as SerializedBasicAuthExpressRequest
        const body = req.body as GenerateTokenBody
        const user = request.user
    
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
            .select("-token")
            .populate("user", "username")

        if(!token) return next(new NotFound("Token with the current id not found"))

        return res.json({
            data : token
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
        
        const request = req as SerializedBasicAuthExpressRequest
        const tokens = await TokenModel
            .find({user : request.user._id}, "-token")
            .populate("user", "username")

        return res.json({
            data : tokens
        })

    }catch(err){
        return next(err)
    }
}