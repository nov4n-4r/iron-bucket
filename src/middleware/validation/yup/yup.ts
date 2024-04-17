import { NextFunction, Request, RequestHandler, Response } from "express"
import * as yup from "yup"

export async function yupValidate(
    target : Object,
    schema : yup.Schema,
    next : NextFunction
) {
    try{
        await schema.validate(target)
        return next()
    }catch(err){
        return next(err)
    }
}

export function reqQueryValidation(schema : yup.Schema): RequestHandler {
    return (
        req : Request,
        res : Response,
        next : NextFunction
    ) => {
        schema.validate(req.query)
            .then(() => next())
            .catch(err => next(err))
    }
}

export function reqBodyValidation(schema : yup.Schema): RequestHandler {
    return (
        req : Request,
        res : Response,
        next : NextFunction
    ) => {
        schema.validate(req.body)
            .then(() => next())
            .catch(err => next(err))
    }
}