import { app } from "./app.js";
import dotenv from "dotenv";
import User from "./models/users.model.js";
import Project from "./models/projects.model.js";
import Task from "./models/tasks.model.js";
import Comment from "./models/comments.model.js";
import { connectDB, sequelize } from "./db/index.js";

dotenv.config({ path: "../.env" });

app.on("error", (error) => {
    console.log("Express server error: ", error)
    process.exit(1)
});

connectDB()
  .then(() => {
    sequelize.sync({ alter: true }) 
      .then(() => {
        console.log("Tables created/updated!");
        app.listen(process.env.PORT || 8000, () => {
          console.log(`Server running on port ${process.env.PORT}`);
        });
      });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
