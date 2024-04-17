import { download, getBucket, getBucketFile, upload as uploadHandler } from "./bucket.controller"
import { upload as uploadFile } from "../../helper/file/multer.file"
import express from "express"
import { reqQueryValidation } from "../../middleware/validation/yup/yup"
import { getBucketFileQuery } from "./bucket.request.schema"
import { requirePermission, tokenRequired } from "../../middleware/auth"

const indexRouter = express.Router()

indexRouter.get(
    "/bucket", 
    tokenRequired,
    requirePermission("file.view"),
    getBucket
)

indexRouter.get(
    "/bucket/:bucket/file",
    tokenRequired,
    requirePermission("file.view"),
    reqQueryValidation(getBucketFileQuery),
    getBucketFile
)

indexRouter.post(
    "/bucket/:bucket/upload/", 
    tokenRequired,
    requirePermission("file.upload"),
    uploadFile.single("file"), 
    uploadHandler
)

indexRouter.get(
    "/bucket/:bucket/file/:filename",
    tokenRequired,
    requirePermission("file.download"),
    download
)

export default indexRouter