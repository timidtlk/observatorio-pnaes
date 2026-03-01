import axios from "axios";
import { BACK_URL, type ILoginCredentials } from "./Utils";

export const API_URI: string = `${BACK_URL}/auth`;

export async function login(user: ILoginCredentials) {
    return axios.post(`${API_URI}/login`, user);
}

export async function requestPasswordReset(loginOrEmail: string) {
    return axios.post(`${API_URI}/forgot-password`, { loginOrEmail });
}

export async function resetPassword(loginOrEmail: string, code: string, newPassword: string) {
    return axios.post(`${API_URI}/reset-password`, { loginOrEmail, code, newPassword });
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
