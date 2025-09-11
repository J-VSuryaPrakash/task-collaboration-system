import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Team from "../models/teams.model.js";
import Project from "../models/projects.model.js";


const createTeam = asyncHandler(async (req, res) => {

    const userId = req.user.id;
    const {teamName,projectId} = req.body;

    const project = await Project.findByPk(projectId);

    if(!project){
        throw new ApiError(404,"Project not found to create team")
    }

    const team = await Team.create({
        teamName: teamName,
        projectId: projectId,
        userId: userId
    })

    if(!team){
        throw new ApiError(500,"Unable to create team")
    }

    return res.status(201)
            .json(new ApiResponse(201,team,"Team is successfully created"))
})

export {
    createTeam
}