import * as yup from "yup"

export const getBucketFileQuery = yup.object().shape({
    filter : yup.object(),
    sort : yup.object(),
    limit : yup.string().test({
        test : (value? : string) => !value || !isNaN(parseInt(value))
    }),
    page : yup.string().test({
        test : (value? : string) => !value || !isNaN(parseInt(value))
    })
}).noUnknown().strict()
