import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import Comment from "../models/comments.model.js";
import Task from "../models/tasks.model.js";
import Project from "../models/projects.model.js";
import Team from "../models/teams.model.js";
import TeamMember from "../models/team_members.model.js";
import User from "../models/users.model.js";

const addCommment = asyncHandler(async(req, res) => {
    const userId = req.user.id;
    const { taskId, content } = req.body;

    if (!content || !taskId) {
        throw new ApiError(400, "The comment and taskId are required.");
    }

    const task = await Task.findByPk(taskId, {
        include: {
            model: Project,
            include: {
                model: Team,
                include: {
                    model: TeamMember,
                    attributes: ['userId'] 
                }
            }
        }
    });

    if (!task) {
        throw new ApiError(404, "Task not found.");
    }
    
    const teamLeadId = task.Project.Team.teamLead;
    const teamMembers = task.Project.Team.TeamMembers.map(member => member.userId);

    const isAuthorized = teamLeadId === userId || teamMembers.includes(userId);

    if (!isAuthorized) {
        throw new ApiError(403, "You do not have permission to comment on this task.");
    }

    const comment = await Comment.create({
        userId,
        taskId,
        content
    });

    if (!comment) {
        throw new ApiError(500, "Unable to create comment.");
    }

    return res.status(201)
        .json(new ApiResponse(201, comment, "Comment added successfully.")); 
});

export {
    addCommment
}
