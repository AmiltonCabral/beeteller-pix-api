require("dotenv").config();

export const PORT = 3000;
export const MAX_CONCURRENT_STREAMS = 6;
export const LONG_POLLING_TIMEOUT_MS = 8000;
export const BATCH_WAIT_INTERVAL_MS = 1000;
export const DB_URI = process.env.DB_URI;
