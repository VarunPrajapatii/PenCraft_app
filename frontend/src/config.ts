import axios from 'axios';

export const BACKEND_URL = import.meta.env.VITE_PENCRAFT_BACKEND_URL || 'http://localhost:8787';
// export const BACKEND_URL = 'https://pencraft-api.varunprajapati123.workers.dev';


// Set axios defaults to always send cookies
axios.defaults.withCredentials = true;