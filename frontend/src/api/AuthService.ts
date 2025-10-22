import axios from "axios";
import type { ILoginCredentials } from "./Utils";

export const API_URI: string = "http://localhost:8080/auth";

export async function login(user: ILoginCredentials) {
    return axios.post(`${API_URI}/login`, user);
}

export async function logout() {
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
}

export function getConfig() {
    const token = sessionStorage.getItem('token') !== null 
                ? sessionStorage.getItem('token') 
                : localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };    
}
