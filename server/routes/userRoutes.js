import express from "express";
import { getCars, getUserData, loginUser, registerUser } from "../controllers/userController.js";
import { Protect } from "../middleware/auth.js";

const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post('/login',loginUser)
userRouter.get('/data',Protect,getUserData)
userRouter.get('/cars',getCars)
export default userRouter;   