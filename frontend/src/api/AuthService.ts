import axios from "axios";
import type { ILoginCredentials } from "./Utils";

export const API_URI: string = "http://localhost:8080/auth";

export async function login(user: ILoginCredentials) {
    return axios.post(`${API_URI}/login`, user);
}
