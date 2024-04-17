import * as yup from "yup";
import { isObjectEmpty } from "../../helper/util.helper";

export const generateTokenBodySchema = yup.object().shape({
    title : yup.string().required(),
    description : yup.string(),
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
    })
    .strict()
    .noUnknown()
}).strict().noUnknown()

export const updateTokenByIdBodySchema = yup.object().shape({
    title : yup.string(),
    description : yup.string()
}).required().strict().noUnknown()