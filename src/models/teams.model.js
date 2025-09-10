import { sequelize } from "../db/index.js";
import { DataTypes } from "sequelize";
import Project from "./projects.model.js";
import User from "./users.model.js";

const Team = sequelize.define('Team', 
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        createdAt:{
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "teams",
        timestamps: false
    }
);

Team.belongsTo(Project,{
    foreignKey: {
        name: "projectId",
        allowNull: false
    },
    targetKey: "id",
    onDelete: "CASCADE"
});

Team.belongsTo(User,{
    foreignKey: {
        name: "teamLead",
        allowNull: false
    },
    targetKey: "id",
    onDelete: "SET NULL"
});

export default Team;
