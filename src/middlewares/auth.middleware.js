import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/users.model.js";

const verifyUser = asyncHandler(async (req, res, next) => {
    
    try {
        
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

        if(!token){
            throw new ApiError(401,"Not authorized, token missing");
        }

        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        if(!decodeToken){
            throw new ApiError(505,"Error in decoding the access token")
        }

        const user = await User.findByPk(decodeToken.id)

        if(!user){
            throw new ApiError(404, "Invalid Access Token")
        }

        req.user = user
        next()

    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Token")
    } 
})

export default verifyUser;