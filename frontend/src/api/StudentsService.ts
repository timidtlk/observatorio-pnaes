import axios from "axios";
import type { IStudent } from "./Utils";

export const API_URI: string = "http://localhost:8080/students";

export async function getAllCampus(): Promise<string[]> {
    return axios.get(`${API_URI}/campus`);
}

export async function getAllCursos(): Promise<string[]> {
    return axios.get(`${API_URI}/cursos`);
}

export async function getAllFormasIngresso(): Promise<string[]> {
    return axios.get(`${API_URI}/ingresso`);
}

export async function getCount(): Promise<number> {
    return axios.get(`${API_URI}/count`);
}

export async function getStudents(campus: string, curso: string, forma_ingresso: string, cotas: string): Promise<IStudent[]> {    
    return axios.get(`${API_URI}?campus=${campus}&curso=${curso}&forma_ingresso=${forma_ingresso}&cotas=${cotas}`);
}