import { Log } from './logger.js';
import 'dotenv/config';
export const diagnosticHandler = async (req, res) => {

    const tests = [
        { name: "Backend DB Log", args: ["backend", "info", "db", "Diagnostic: DB Check"] },
        { name: "Frontend Component Log", args: ["frontend", "warn", "component", "Diagnostic: UI Check"] },
        { name: "Error Handler Log", args: ["backend", "error", "handler", "Diagnostic: Error Check"] }
    ];

    const results = [];

    for (const test of tests) {
        const response = await Log(...test.args);
        results.push({
            test: test.name,
            status: response?.logID ? "PASSED" : "FAILED",
            logID: response?.logID || null,
            error: response?.message || response?.error || null
        });
    }

  
    const allPassed = results.every(r => r.status === "PASSED");
    
    return res.status(allPassed ? 200 : 207).json({
        system: "Logging Middleware",
        timestamp: new Date().toISOString(),
        overall_health: allPassed ? "Healthy" : "Degraded",
        results
    });
};