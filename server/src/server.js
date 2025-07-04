import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';

const app = express();

app.get("/", (req, res) => res.send("Working"));

const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => console.log(`Listening on http://localhost:${ENV.PORT}`));
    } catch (error) {
        console.log("Failed to start the server:", error.message);
    }
};

startServer();