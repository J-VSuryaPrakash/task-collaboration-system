import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import TeamMember from "../models/team_members.model.js";
import Team from "../models/teams.model.js";
import User from "../models/users.model.js";
import Project from "../models/projects.model.js";


const addTeamMember = asyncHandler(async(req, res) => {

    const leadId = req.user.id;
    const {memberId, teamId, role} = req.body;

    if(!(memberId && teamId)){
        throw new ApiError(404,"The Memberid and teamId is required");
    }

    const team = await Team.findByPk(teamId)

    if(!team){
        throw new ApiError(404,"Team is not found");
    }
    
    if(team.teamLead !== leadId){
        throw new ApiError(404,"Only team lead can add members")
    }
    
    const member = await User.findByPk(memberId);

    if(!member){
        throw new ApiError(404,"Member not found");
    }

    const existingMember = await TeamMember.findAll({
        where:{
            teamId,memberId
        }
    })

    if(existingMember){
        throw new ApiError(404,"Member already exists in team")
    }

    const newMember = await TeamMember.create({
        teamId,
        memberId,
        role
    })

    return res.status(201)
            .json(new ApiResponse(201,newMember,"New member added to team"))

})

const getAllMembers = asyncHandler(async(req, res) => {

    const {teamId} = req.body;
    const userId = req.user.id;

    const isMember = await TeamMember.findAll({
        where: {teamId,memberId: userId}
    })

    if(!isMember){
        throw new ApiError(403,"Member is not allowed to access")
    }

    const teamMembers = await TeamMember.findAll(
        {
            where: {
                teamId
            },
            include: {
                model: User,
                attributes: [id,firstName,lastName,userName]
            }
            
        }
    )

    return res.status(200)
            .json(new ApiResponse(200,teamMembers,"Team members are fetched"))

})


const removeTeamMember = asyncHandler(async(req, res) => {

    const leadId = req.user.id;

    const {teamId,memberId} = req.body;

    const teamLead = await Team.findOne({
        where:{
            id:teamId,
            teamLead: leadId
        }
    })

    if(!teamLead){
        throw new ApiError(403,"Donot have permission to remove member")
    }

    const teamMember = await TeamMember.findOne({
        where: {
            teamId,memberId
        }
    })

    if(memberId === leadId){
        throw new ApiError(400, "A team lead cannot remove themselves from a team.");
    }

    if(!teamMember){
        throw new ApiError(404,"Team does not exist")
    }

    if(teamMember.memberId !== memberId){
        throw new ApiError(404,"Member is not present in the team")
    }

    await teamMember.destroy()

    return res.status(200)
            .json(200,{},"Member removed successfully")

})


export {
    addTeamMember,
    getAllMembers,
    removeTeamMember
}