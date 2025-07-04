import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';

const app = express();

connectDB();

const port = 8080

app.listen(ENV.PORT, () => console.log(`Listening on http://localhost:${ENV.PORT}`));

app.get("/", (req, res) => res.send("Working"));