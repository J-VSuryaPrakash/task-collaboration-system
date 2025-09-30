import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Task from "../models/tasks.model.js";
import Project from "../models/projects.model.js";
import User from "../models/users.model.js";


const assignTask = asyncHandler(async (req, res) => {

    const {assignedBy} = req.user.id;
    const {title, taskDescription, assignedTo, deadline, projectId} = req.body;

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

    return res.status(201)
            .json(new ApiResponse(201,task,"Task is successfully created"))
})


const updateTask = asyncHandler(async(req, res) => {

    const {taskId, title, taskDescription, deadline,assignedTo} = req.body
    const userId = req.user.id;

    const taskToUpdate = await Task.findByPk(taskId,{
        include:{
            model: Project,
            attributes:['projectLead']
        }
    })

    if (!taskToUpdate) {
        throw new ApiError(404, "Task not found.");
    }

    if(taskToUpdate.Project.projectLead !== userId){
        throw new ApiError(403, "You do not have permission to update this task.")
    }
    
    const [updatedRowsCount] = await Task.update(
        {
            title: title,
            taskDescription: taskDescription,
            deadline: deadline,
            assignedTo: assignedTo
        }, {
        where: { id: taskId }
    })

    if(updatedRowsCount === 0){
        throw new ApiError(500, "Unable to update the task.");
    }
    
    const updatedTask = await Task.findByPk(taskId, {
        include: [
            { model: Project },
            { model: User, as: 'assignedToUser',attributes:['id','userName','email','role'] },
            { model: User, as: 'assignedByUser',attributes:['id','userName','email','role'] }
        ]
    })

    return res.status(200)
            .json(new ApiResponse(200,updatedTask,"Task is updated successfully"))
})


const deleteTask = asyncHandler(async(req,res) => {

    const {taskId} = req.body;
    const userId = req.user.id;

    const taskToDelete = await Task.findByPk(taskId,{
        include:{
            model: Project,
            attributes: ['projectLead']
        }
    })

    if(!taskToDelete){
        throw new ApiError(404, "Task not found.");
    }

    if(taskToDelete.Project.projectLead !== userId){
        throw new ApiError(400,"No permission to delete the task")
    }

    await taskToDelete.destroy()

    return res.status(200)
            .json(new ApiResponse(200,{},"Task Deleted Successfully"))
}) 


const getTask = asyncHandler(async(req,res) => {

    const {taskId} = req.body;
    const userId = req.user.id;

    const task = await Task.findByPk(taskId,{
        include:[{
            model: Project,
            attributes: ['id','projectName','projectLead',]
        },
        {
            model: User,
            as: 'assignedToUser',
            attributes:['id','userName']
        },
        {
            model: User,
            as: 'assignedByUser',
            attributes:['id','userName']
        }]    
    })
    
    if(!task){
        throw new ApiError(400,"Task is not found")
    }

    if (task.Project.projectLead !== userId && task.assignedTo?.id !== userId) {
        throw new ApiError(403, "You do not have permission to view this task.");
    }

    return res.status(200)
            .json(new ApiResponse(200,task,"Task is fetched"))

}) 

export {
    assignTask,
    updateTask,
    deleteTask,
    getTask
}