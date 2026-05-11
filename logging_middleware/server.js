import express from 'express';
import dotenv from 'dotenv';
import { diagnosticHandler } from './loggerController.js';
import { requestLogger } from './logger.js';



dotenv.config();
const app = express();
app.use(express.json());


app.use(requestLogger);


app.get('/api/admin/diagnostics/logging', diagnosticHandler);

app.listen(3000, () => {

    console.log("Server running on http://localhost:3000");
});