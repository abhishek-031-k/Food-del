import express from "express"
import { loginUser,registerUser } from "../controllers/userController.js"
import tokenBucketRateLimiter from "../middleware/rateLimiter.js";

const userRouter = express.Router()
userRouter.post("/register", registerUser)
userRouter.post("/login", tokenBucketRateLimiter, loginUser)

export default userRouter;