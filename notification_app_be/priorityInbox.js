import { Log } from '../logging_middleware/logger.js';

import dotenv from 'dotenv';
import 'dotenv/config';

dotenv.config();


const API_URL = "http://4.224.186.213/evaluation-service/notifications";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;


const PRIORITY_WEIGHTS = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
};

async function getPriorityNotifications(n = 10) {
    try {
        const response = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
        });
        const data = await response.json();
        const notifications = data.notifications || [];

       

        const sortedInbox = notifications
            .map(notif => ({
                ...notif,
                score: (PRIORITY_WEIGHTS[notif.Type] || 0) * 10000000000 + new Date(notif.Timestamp).getTime()
            }))
            .sort((a, b) => b.score - a.score) 
            .slice(0, n);

       
        await Log("backend", "info", "service", `Generated Priority Inbox: Top ${n} items extracted.`);

        console.log(`--- Top ${n} Priority Notifications ---`);
        console.table(sortedInbox.map(i => ({ 
            Type: i.Type, 
            Message: i.Message, 
            Time: i.Timestamp 
        })));

        return sortedInbox;
    } catch (error) {
        await Log("backend", "error", "handler", `Priority Inbox failed: ${error.message}`);
    }
}

getPriorityNotifications(10);