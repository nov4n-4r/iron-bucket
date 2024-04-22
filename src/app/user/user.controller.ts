import { NextFunction, Request, Response } from "express";
import UserModel from "../../helper/database/model/user.model";
import * as yup from "yup"
import { IUser, SerializedJWTExpressRequest } from "../../type";
import { mongo } from "mongoose";
import BadRequest from "../../helper/error/BadRequest";
import NotFound from "../../helper/error/NotFound";
import { compareAccess } from "../../helper/util.helper";
import Forbidden from "../../helper/error/Forbidden";

export async function createUser(
    req : Request,
    res : Response,
    next : NextFunction
){

    try{

        const body = req.body as IUser

        const {user : tokenUser} = req as SerializedJWTExpressRequest 

        const admin = await UserModel.findById(tokenUser._id)

        if(!admin){
            return next(new Error("Something went wrong!"))
        }

        if(body.access){
            compareAccess(admin.toObject({getters : false}), body.access)
        }

        const newUser = new UserModel(body)

        await newUser.save()

        const data = newUser.toObject({getters : true})
        
        return res.json({data})

    }catch(err){

        if(err instanceof mongo.MongoServerError){
            if(err.code === 11000) return next(new BadRequest(err.message))
        }

        return next(err)
    
    }

}


export async function viewUser(
    req : Request,
    res : Response,
    next : NextFunction
){

    try{

        const query = req.query?.filter as object ?? {}
        const users = await UserModel.find(query, "-password")

        return res.json({
            data : users
        })

    }catch(err){
        return next(err)
    }

}

export async function viewUserDetailById(
    req : Request,
    res : Response,
    next : NextFunction
){

    try{

        const {userId} = req.params as {userId : string}

        const user = await UserModel.findById(userId, "-password")

        if(!user){
            return next(new NotFound("User not found"))
        }

        return res.json({data : user})

    }catch(err){
        return next(err)
    }

}

export async function updateUserById(
    req : Request,
    res : Response,
    next : NextFunction
){

    try{

        const {userId} = req.params as {userId : string}
        const body = req.body as Record<string, any>
        const {user : tokenUser} = req as SerializedJWTExpressRequest 

        // prevent current user to update his own data
        if(userId === tokenUser._id.toString()){
            return next(new Forbidden("Unable to update your own data"))
        }

        // checking current user data
        const admin = await UserModel.findById(tokenUser._id)

        if(!admin){
            return next(new Error("Something went wrong!"))
        }

        // prevent current user give access to target user more than his capability
        if(body.access){
            compareAccess(admin.toObject({getters : false}), body.access)
        }

        // checking target user data
        const user = await UserModel.findById(userId)

        if(!user){{
            return next(new NotFound("User not found"))
        }}

        if(user.owner){
            return next(new Forbidden("Unable to update owner's data"))
        }

        Object.keys(body).forEach(
            key => user[key] = body[key]
        )

        // updating target user data
        await user.save()

        return res.json({
            data : user.toObject({getters : false})
        })

    }catch(err){
        return next(err)
    }

}

export async function deleteUserById(
    req : Request,
    res : Response,
    next : NextFunction
){ 

    try{

        const {userId} = req.params as {userId : string}
        const {user : tokenUser} = req as SerializedJWTExpressRequest 

        // prevent current user to update his own data
        if(userId === tokenUser._id.toString()){
            return next(new Forbidden("Unable to delete your own account"))
        }

        // checking target user data
        const user = await UserModel.findById(userId)

        if(!user){{
            return next(new NotFound("User not found"))
        }}

        if(user.owner){
            return next(new Forbidden("Unable to delete owner's data"))
        }

        user.isDeleted = true

        // updating target user data
        await user.save()

        return res.json({
            data : user.toObject({getters : false})
        })

    }catch(err){
        return next(err)
    }

}

export async function recoveryUserById(
    req : Request,
    res : Response,
    next : NextFunction
){ 

    try{

        const {userId} = req.params as {userId : string}
        const {user : tokenUser} = req as SerializedJWTExpressRequest 

        // prevent current user to update his own data
        if(userId === tokenUser._id.toString()){
            return next(new Forbidden("Unable to recovery your own account"))
        }

        // checking target user data
        const user = await UserModel.findById(userId)

        if(!user){{
            return next(new NotFound("User not found"))
        }}

        if(user.owner){
            return next(new Forbidden("Unable to update owner's data"))
        }

        user.isDeleted = false

        // updating target user data
        await user.save()

        return res.json({
            data : user.toObject({getters : false})
        })

    }catch(err){
        return next(err)
    }

}