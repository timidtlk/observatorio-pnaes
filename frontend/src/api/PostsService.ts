import axios from "axios";
import type { IPost } from "./Utils";

export const API_URI: string = "http://localhost:8080/posts";

export async function createPost(post: IPost) {
    return axios.post(API_URI, post);
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

export async function updatePost(post: IPost) {
    return axios.put(API_URI, post);
}