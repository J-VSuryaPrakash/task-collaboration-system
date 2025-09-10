import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler";
import Task from "../models/tasks.model.js";


const assignTask = asyncHandler(async (req, res) => {

    const {assignedBy} = req.user.id;
    const {title, taskDescription, assignedTo,deadline, projectId} = req.body;

    if(!projectId){
        throw new ApiError(404,"Project is not found to assign task");
    }

    if(!title){
        throw new ApiError(404,"Title of the task is required");
    }

    const task = await Task.create({
        title: title,
        deadline: deadline, 
        projectId: projectId,
        assignedTo: assignedTo,
        assignedBy: assignedBy,
        taskDescription: taskDescription 
    })

    if(!task){
        throw new ApiError(500,"Unable to create task")
    }

    return res.status(200)
            .json(new ApiResponse(200,task,"Task is successfully created"))
})


const updateTask = asyncHandler(async(req, res) => {

    const {title, taskDescription} = req.body;

    

})

export {
    assignTask
}