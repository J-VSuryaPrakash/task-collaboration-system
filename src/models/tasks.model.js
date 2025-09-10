import { sequelize } from "../db/index.js";
import { DataTypes, ENUM } from "sequelize";
import Project from "./projects.model.js";
import User from "./users.model.js";

const Task = sequelize.define('Task',{
    id:{
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    taskDescription:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM("Todo","In Progress","Done"),
        allowNull: false,
        defaultValue: "Todo"
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},
{
    tableName: "tasks",
    timestamps: false
});


Task.belongsTo(Project, {
    foreignKey: {
        name: "projectId",
        allowNull: false
    },
    targetKey: "id",
    onDelete: "CASCADE"
});

Task.belongsTo(User, {
    foreignKey: {
        name: "assignedTo",
        allowNull: true
    },
    targetKey: "id",
    onDelete: "SET NULL"
});

Task.belongsTo(User, {
    foreignKey: {
        name: "assignedBy",
        allowNull: true
    },
    targetKey: "id",
    onDelete: "SET NULL"
});

export default Task;