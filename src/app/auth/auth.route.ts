import express from "express"
import { reqBodyValidation } from "../../middleware/validation/yup/yup"
import { generateTokenBodySchema } from "./auth.request.schema"
import { generateToken, revokeTokenById, viewToken } from "./auth.controller"
import { activeUserOnly, basicAuthRequired } from "../../middleware/auth.middleware"

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
    activeUserOnly,
    reqBodyValidation(generateTokenBodySchema),
    generateToken
)

// get tokens
// GET /auth/token
authRouter.get(
    "/token",
    basicAuthRequired,
    activeUserOnly,
    viewToken
)

// revoke token
// DELETE /auth/token/:tokenId
authRouter.delete(
    "/token/:tokenId",
    basicAuthRequired,
    activeUserOnly,
    revokeTokenById
)

export default authRouter