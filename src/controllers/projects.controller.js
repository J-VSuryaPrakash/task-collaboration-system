import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import Project from "../models/projects.model.js";
import User from "../models/users.model.js";

const projectDetails = asyncHandler(async (req, res) => {

    const projectLead = req.user.id;
    const {projectName, projectDescription} = req.body;

    if(!projectName){
        throw new ApiError(404,"Project Name is required");
    }

    const newProject = await Project.create({
        projectName,
        projectDescription,
        projectLead
    })

    if(!newProject){
        throw new ApiError(500,"Unable to create project");
    }

    res.status(201)
    .json(
        new ApiResponse(201,newProject,"Project created successfully")
    )

})

const deleteProject = asyncHandler(async(req, res) => {

    const {projectId} = req.body;

    const projectLead = req.user.id;

    const project = await Project.findByPk(projectId);

    if(!project){
        throw new ApiError(404,"Project is not found")
    }

    if(project.projectLead !== projectLead){
        throw new ApiError(404,"You dont have permission to delete the project")
    }

    await project.destroy()

    res.status(200)
        .json(200,{},"Project is successfully deleted");

})

const updateProject = asyncHandler(async(req, res) => {
    
    const {projectId, projectName, projectDescription} = req.body;
    const projectLead = req.user.id;

    if(!projectName){
        throw new ApiError(404,"Project Name cannot be null");
    }

    const project = await Project.findByPk(projectId);

    if(!project){
        throw new ApiError(404, "Project not found");
    }

    if(project.projectLead !== projectLead){
        throw new ApiError(404,"No permission to update the project details")
    }

    project.projectName = projectName;

    if(projectDescription){
        project.projectDescription = projectDescription;
    }

    await project.save({validate: false})

    return res.status(200)    
        .json(new ApiResponse(200,project,"Project details updated"))
})


const getAllProjects = asyncHandler(async(req, res) => { 

    const userId = req.user.id;

    const projectList = await Project.findAll({
        where: {
            projectLead : userId
        },
        attributes: ["id","projectName","projectDescription"],
        include: {
            model: User,
            attributes: ["id","userName"]
        }
    })   

    if(projectList.length === 0){
        return res.status(200)
                .json(new ApiResponse(200,[],"No projects are assigned"))
    }

    return res.status(200)
            .json(new ApiResponse(200,projectList,"Projects are fetched"));
})

export {
    projectDetails,
    deleteProject,
    updateProject,
    getAllProjects
}
