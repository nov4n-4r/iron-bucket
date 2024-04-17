import express from "express"
import { reqBodyValidation, yupValidate } from "../../middleware/validation/yup/yup"
import { generateTokenBodySchema, updateTokenByIdBodySchema } from "./auth.request.schema"
import { generateToken, revokeTokenById, updateTokenById, viewToken } from "./auth.controller"
import { tokenRequired } from "../../middleware/auth"

const authRouter = express.Router()

/**
 * Base URL
 * /auth/...
 */

// generate token
// POST /auth/token
authRouter.post(
    "/token",
    reqBodyValidation(generateTokenBodySchema),
    generateToken
)

// get tokens
// GET /auth/token
authRouter.get(
    "/token",
    tokenRequired,
    viewToken
)

// revoke token
// DELETE /auth/token/:tokenId
authRouter.delete(
    "/token/:tokenId",
    tokenRequired,
    revokeTokenById
)

// update token
// PUT /auth/token/:tokenId
authRouter.put(
    "/token/:tokenId",
    tokenRequired,
    reqBodyValidation(updateTokenByIdBodySchema),
    updateTokenById
)

export default authRouter