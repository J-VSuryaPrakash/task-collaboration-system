import { sequelize } from "../db/index.js";
import { DataTypes } from "sequelize";
import User from "./users.model.js";
import Task from "./tasks.model.js";

const Comment = sequelize.define('Comment',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        content:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "comments",
        timestamps: false                          
    }
);

Comment.belongsTo(User, {
    foreignKey: {
        name: "userId",
        allowNull: false
    },
    targetKey: "id",
    onDelete: "CASCADE"
});

Comment.belongsTo(Task, {
    foreignKey: {
        name: "taskId",
        allowNull: false
    },
    targetKey: "id",
    onDelete: "CASCADE"
});

export default Comment
