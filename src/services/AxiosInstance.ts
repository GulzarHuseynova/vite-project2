import axios from "axios";

// ❌ KÖHNƏ VERSİYA: Vercel-də (https) HTTP-yə birbaşa müraciət bloklanır
// const API_URL = "http://161.97.154.119/intern-api/api";

// ✅ YENİ VERSİYA: Sizin Vercel serverinizdən keçərək gedəcək
const API_URL = "/api";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;