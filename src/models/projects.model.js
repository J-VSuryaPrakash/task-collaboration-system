import { sequelize } from "../db/index.js";
import { DataTypes } from "sequelize";
import User from "./users.model.js";

const Project = sequelize.define('Project', 
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        projectName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        projectDescription: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "projects",
        timestamps: false
    }
);

Project.belongsTo(User, {
    foreignKey: {
        name: "projectLead",
        allowNull: true
    },
    targetKey: "id",
    onDelete: "SET NULL"
})

export default Project