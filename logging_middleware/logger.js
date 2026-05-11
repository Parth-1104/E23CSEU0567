import 'dotenv/config';

const API_URL = "http://4.224.186.213/evaluation-service/logs";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;


const LOG_CONFIG = {
  STACKS: ["backend", "frontend"],
  LEVELS: ["debug", "info", "warn", "error", "fatal"],
  PACKAGES: {
    BACKEND: ["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service"],
    FRONTEND: ["api", "component", "hook", "page", "state", "style"],
    SHARED: ["auth", "config", "middleware", "utils"]
  }
};

const VALID_PACKAGES = [
  ...LOG_CONFIG.PACKAGES.BACKEND,
  ...LOG_CONFIG.PACKAGES.FRONTEND,
  ...LOG_CONFIG.PACKAGES.SHARED
];

export const Log = async (stack, level, pkg, message) => {
  const s = stack?.toLowerCase();
  const l = level?.toLowerCase();
  const p = pkg?.toLowerCase();

 
  if (!LOG_CONFIG.STACKS.includes(s)) return { error: "Invalid Stack" };
  if (!LOG_CONFIG.LEVELS.includes(l)) return { error: "Invalid Level" };
  if (!VALID_PACKAGES.includes(p)) return { error: "Invalid Package" };

  const payload = {
    stack: s,
    level: l,
    package: p,
    message: typeof message === 'object' ? JSON.stringify(message) : String(message)
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    return await res.json();
  } catch (err) {

    return { success: false, error: err.message };
  }
};


export const requestLogger = (req, res, next) => {
  Log("backend", "info", "middleware", `${req.method} ${req.url}`);
  next();
};