import dotenv from 'dotenv';

dotenv.config();

const apiUrl = process.env.REACT_APP_API_URL;
const apiKey = process.env.REACT_APP_API_KEY;

export { apiUrl, apiKey };