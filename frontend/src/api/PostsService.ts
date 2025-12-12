import axios from "axios";
import { BACK_URL, type IPost } from "./Utils";
import { getConfig } from "./AuthService";

export const API_URI: string = `${BACK_URL}/posts`;

export async function createPost(post: Partial<IPost>) {
    return axios.post(API_URI, post, getConfig());
} 

export async function getPosts() {
    return axios.get(API_URI);
}

export async function searchPosts(searchTerm: string) {
    return axios.get(`${API_URI}/search?q=${searchTerm}`);
}

export async function getPostByLink(link: string) {
    return axios.get(`${API_URI}/${link}`);
}

export async function getPostsByUser(user: string) {
    return axios.get(`${API_URI}/user/${user}`, getConfig());
}

export async function updatePost(post: IPost) {
    return axios.put(API_URI, post, getConfig());
}