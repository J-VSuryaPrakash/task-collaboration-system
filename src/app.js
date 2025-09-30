import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"

const app = express();

dotenv.config({
    path: '../.env'  
});

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/projects.route.js';
import taskRoutes from './routes/task.route.js';
import commentRoutes from './routes/comments.route.js';

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/comments', commentRoutes);

export { app };
