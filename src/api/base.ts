/// <reference types="vite/client" />
// Axios instances for the two backends. URLs and the optional auth token
// come from environment variables (see .env.example) so nothing
// environment-specific or secret is committed.
import axios from 'axios';

const DEFAULT_URL = 'http://localhost:3000/';

// AttendanceMain (core API)
const mainUrl = import.meta.env.VITE_BACKEND || DEFAULT_URL;
// AttendanceReport2 (report / admin service)
const reportUrl = import.meta.env.VITE_REPORT_BACKEND || DEFAULT_URL;
const authorization = import.meta.env.VITE_AUTHORIZATION;

const base = axios.create({
    baseURL: mainUrl,
    headers: {
        ...(authorization ? { authorization } : {}),
        'Content-Type': 'application/json',
    }
});

export const local = axios.create({
    baseURL: reportUrl,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default base;
