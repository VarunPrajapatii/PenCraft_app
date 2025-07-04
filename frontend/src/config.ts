import axios from 'axios';

export const BACKEND_URL = "http://127.0.0.1:8787";

// Set axios defaults to always send cookies
axios.defaults.withCredentials = true;