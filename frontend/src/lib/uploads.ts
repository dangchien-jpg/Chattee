import axios from "axios";

export const apiCloud = axios.create({
  baseURL: import.meta.env.VITE_CLOUDINARY_CLOUD_URL,
});
