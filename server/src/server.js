import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';

import userRoutes from './routes/user.route.js';

import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';


const app = express();

app.use(cors());
app.use(express.json());

app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("Working"));

app.use("/api/users", userRoutes);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => console.log(`Listening on http://localhost:${ENV.PORT}`));
    } catch (error) {
        console.log("Failed to start the server:", error.message);
    }
};

startServer();