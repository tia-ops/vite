// src/apiConfig.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("VITE_API_BASE_URL tidak terdefinisi. Pastikan file .env sudah benar.");
}

export default API_BASE_URL;