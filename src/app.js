import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import { ApiError } from "./utils/ApiError.js";

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

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            data: err.data,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";

    return res.status(statusCode).json({
        success: false,
        message: message,
        errors: [],
        data: null,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});


export { app };
