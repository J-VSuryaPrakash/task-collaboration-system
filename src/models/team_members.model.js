import { sequelize } from "../db/index.js";
import { DataTypes } from "sequelize";
import Team from "./teams.model.js";
import User from "./users.model.js";

const TeamMember = sequelize.define('TeamMember',{
    id:{
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    tableName: "teamMembers",
    timestamps: false
})


TeamMember.belongsTo(Team,{
    foreignKey: {
        name: "teamId",
        allowNull: false
    },
    targetKey: "id",
});

TeamMember.belongsTo(User,{
    foreignKey: {
        name: "memberId",
        allowNull: false
    },
    targetKey: "id",
});


export default TeamMember;