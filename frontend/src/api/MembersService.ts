import axios from "axios";
import { BACK_URL, type IMember } from "./Utils";
import { getConfig } from "./AuthService";

export const API_URI: string = `${BACK_URL}/members`;

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
    return axios.put(`${API_URI}/${member.id}`, member, getConfig());
}

export async function updatePhoto(formData: unknown) {
    return axios.put(`${API_URI}/photo`, formData, getConfig());
}

export async function updatePhotoById(id: string, file: File) {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("file", file);
    return axios.put(`${API_URI}/photo`, formData, {
        headers: {
            ...getConfig().headers,
            "Content-Type": "multipart/form-data",
        },
    });
}

export async function getMemberByToken(): Promise<IMember> {
    return (await axios.get(`${API_URI}/this`, getConfig())).data;
}

export async function changePassword(currentPassword: string, newPassword: string) {
    return axios.put(`${API_URI}/change-password`, {
        currentPassword,
        newPassword,
        confirmPassword: newPassword
    }, getConfig());
}

export async function adminCreateMember(member: Partial<IMember> & { password: string; login: string; role: string; showAbout?: boolean; }) {
    return axios.post(API_URI, member, getConfig());
}

export async function adminUpdateMember(member: IMember) {
    return axios.put(`${API_URI}/${member.id}`, member, getConfig());
}

export async function deleteMember(id: string) {
    return axios.delete(`${API_URI}/${id}`, getConfig());
}