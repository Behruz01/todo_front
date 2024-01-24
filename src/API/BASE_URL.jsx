import axios from "axios";

export const apiRoot = axios.create({
  baseURL: `http://localhost:1001/api/`,

  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${token}`,
  },
});