import axios from "axios";

// YENİ VƏ DÜZGÜN URL
const API_URL = "/intern-api/api";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;