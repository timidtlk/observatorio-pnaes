import axios from "axios";
import type { IMember } from "./Utils";
import { getConfig } from "./AuthService";

export const API_URI: string = "http://localhost:8080/members";

export async function createMember(member: IMember) {
    return axios.post(API_URI, member);
} 

export async function getMembers() {
    return axios.get(API_URI);
}

export async function getMember() {
    return axios.get(`${API_URI}/this`, getConfig());
}

export async function updateMember(member: IMember) {
    return axios.post(API_URI, member, getConfig());
}

export async function updatePhoto(formData: unknown) {
    return axios.put(`${API_URI}/photo`, formData, getConfig());
}

export async function getMemberByToken(): Promise<IMember> {
    return (await axios.get(`${API_URI}/this`, getConfig())).data;
}