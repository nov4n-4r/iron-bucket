import * as yup from "yup"
import { isObjectEmpty } from "../../helper/util.helper"

export const viewUserQuerySchema = yup.object().shape({
    filter : yup.object()
}).noUnknown().strict(true)

export const createUserBodySchema = yup.object().shape({
    username : yup.string().required(),
    password : yup.string().required(),
    access : yup.object().shape({
        user : yup.object().shape({
            view : yup.boolean().default(true),
            create : yup.boolean(),
            update : yup.boolean(),
            delete : yup.boolean()
        }).strict().noUnknown(),
        file : yup.object().shape({
            download : yup.boolean().default(true),
            view : yup.boolean().default(true),
            upload : yup.boolean(),
            update : yup.boolean(),
            delete : yup.boolean()
        }).strict().noUnknown()
    })
    .required()
    .test({
        "message" : "access shouldn't empty",
        "test" : value => !isObjectEmpty(value)
    }),
}).strict().noUnknown()

export const updateUserBodySchema = yup.object().shape({
    access : yup.object().shape({
        user : yup.object().shape({
            view : yup.boolean(),
            create : yup.boolean(),
            update : yup.boolean(),
            delete : yup.boolean()
        }).strict().noUnknown(),
        file : yup.object().shape({
            download : yup.boolean(),
            view : yup.boolean(),
            upload : yup.boolean(),
            update : yup.boolean(),
            delete : yup.boolean()
        }).strict().noUnknown()
    }),
}).strict().noUnknown()