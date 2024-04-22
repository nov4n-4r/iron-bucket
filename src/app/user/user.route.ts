import express from "express"
import { createUser, deleteUserById, recoveryUserById, updateUserById, viewUser, viewUserDetailById } from "./user.controller"
import { activeUserOnly, requirePermission, tokenRequired } from "../../middleware/auth.middleware"
import { reqBodyValidation, reqQueryValidation } from "../../middleware/validation/yup/yup"
import { createUserBodySchema, updateUserBodySchema, viewUserQuerySchema } from "./user.request.schema"

const userRouter = express.Router()

/**
 * Base URL
 * /user/...
 */

// get all users
userRouter.get(
    "/",
    tokenRequired,
    requirePermission("user.view"),
    reqQueryValidation(viewUserQuerySchema),
    viewUser
)

// view user's detail
userRouter.get(
    "/:userId",
    tokenRequired,
    requirePermission("user.view"),
    viewUserDetailById
)

// create new user
userRouter.post(
    "/",
    tokenRequired,
    activeUserOnly,
    requirePermission("user.create"),
    reqBodyValidation(createUserBodySchema),
    createUser
)

// update user's data
userRouter.put(
    "/:userId",
    tokenRequired,
    activeUserOnly,
    requirePermission("user.update"),
    reqBodyValidation(updateUserBodySchema),
    updateUserById
)

// delete user
userRouter.delete(
    "/:userId",
    tokenRequired,
    activeUserOnly,
    requirePermission("user.delete"),
    deleteUserById
)

userRouter.all(
    "/:userId/recovery",
    tokenRequired,
    activeUserOnly,
    requirePermission("user.delete"),
    recoveryUserById
)

export default userRouter