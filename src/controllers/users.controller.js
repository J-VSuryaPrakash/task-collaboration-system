import {asyncHandler} from "../utils/asyncHandler.js";
import User from "../models/users.model.js";
import { Op } from "sequelize";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async(userId) => {
    try {
        
        const user = await User.findByPk(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({validate: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh token");
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const {firstName, lastName, userName, email, password} = req.body;

    if([firstName, lastName, userName, email, password].some((field) => (field?.trim() === ""))){
        throw new ApiError(404,"All fields are required");
    }

    const userExists = await User.findOne({
        where:{email:email}
    })

    if(userExists){
        throw new ApiError(400,"User already exists");
    }

    const user = await User.create({
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        email: email,
        password: password
    })

    if(!user){
        throw new ApiError(500,"Error in creating the user");
    }

    // need to handle the response properly

    return res.status(200)
    .json(
        new ApiResponse(200,{id: user.id, userName: user.userName, email: user.email},"User created successfully")
    )

})


const loginUser = asyncHandler(async (req, res) => {

    const {email, password} = req.body;

    if(!email){
        throw new ApiError(404,"Email is required");
    }

    const user = await User.findOne({
        where:{email: email}
    })

    if(!user){
        throw new ApiError(500,"User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(404,"Password is incorrect");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user.id)

    await user.update({ refreshToken }, { where: { id: user.id } });

    return res.status(200)
    .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true
    })
    .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true
    })
    .json(
        new ApiResponse(200,{user,refreshToken,accessToken},"User logged in successfully")
    )
})


const logoutUser = asyncHandler(async (req, res) => {

    const user = await User.findByPk(req.user.id);

    if (user) {
        user.refreshToken = null;
        await user.save({ validate: false });
    }

    return res.status(200)
            .clearCookie("accessToken",{ 
                httpOnly: true,
                secure: true
            })
            .clearCookie("refreshToken", {
                httpOnly: true,
                secure: true
            })
            .json(new ApiResponse(200, {}, "User logged Out"));
})


const updateUserDetails = asyncHandler(async (req, res) => {

    const {userName, email} = req.body;

    if(!(userName || email)){
        throw new ApiError(404,"Any of the field is required");
    }

    const [updatedRow] = await User.update(
        { userName, email },
        { where: {id : req.user.id} })

    if(!updatedRow){
       throw new ApiError(500,"Updating details failed") 
    }

    return res.status(200)
            .json(new ApiResponse(200,{},"User details updated successfully!"))

}) 

const updatePassword = asyncHandler(async(req,res) => {

    const user = await User.findByPk(req.user.id);

    if(!user){
        throw new ApiError(400,"User is not found");
    }

    const {newPassword} = req.body

    if(!newPassword){
        throw new ApiError(400,"Field is required")
    }

    user.password = newPassword;

    await user.save({validate: false});

    return res.status(200)
            .json(new ApiResponse(200,{},"Password Updated!"))
})


export {
    registerUser,
    loginUser,
    logoutUser,
    updateUserDetails,
    updatePassword
}