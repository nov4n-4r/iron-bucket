import express from "express"
import { reqBodyValidation } from "../../middleware/validation/yup/yup"
import { generateTokenBodySchema } from "./auth.request.schema"
import { generateToken, revokeTokenById, viewToken } from "./auth.controller"
import { basicAuthRequired } from "../../middleware/auth.middleware"

const authRouter = express.Router()

/**
 * Base URL
 * /auth/...
 */

// generate token
// POST /auth/token
authRouter.post(
    "/token",
    basicAuthRequired,
    reqBodyValidation(generateTokenBodySchema),
    generateToken
)

// get tokens
// GET /auth/token
authRouter.get(
    "/token",
    basicAuthRequired,
    viewToken
)

// revoke token
// DELETE /auth/token/:tokenId
authRouter.delete(
    "/token/:tokenId",
    basicAuthRequired,
    revokeTokenById
)

// update token
// PUT /auth/token/:tokenId
// authRouter.put(
//     "/token/:tokenId",
//     tokenRequired,
//     reqBodyValidation(updateTokenByIdBodySchema),
//     updateTokenById
// )

export default authRouter