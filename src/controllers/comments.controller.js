import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Comment from "../models/comments.model.js";
import Task from "../models/tasks.model.js";
import Project from "../models/projects.model.js";

const addComment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { taskId, content } = req.body;

  if (!content || !taskId) {
    throw new ApiError(400, "Task ID and comment content are required.");
  }

  const task = await Task.findByPk(taskId, {
    include: {
      model: Project,
      attributes: ["id", "projectLead"]
    }
  });

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  const isAuthorized =
    task.Project.projectLead === userId || task.assignedTo === userId;

  if (!isAuthorized) {
    throw new ApiError(403, "You do not have permission to comment on this task.");
  }

  const comment = await Comment.create({
    userId,
    taskId,
    content
  });

  return res.status(201).json(new ApiResponse(201, comment, "Comment added successfully."));
});

export { addComment };
