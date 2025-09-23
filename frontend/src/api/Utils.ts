export interface IMember {
    id: string,
    name: string,
    description: string,
    email: string,
    lattes: string,
    photoUrl: string
}

export interface IPost {
    id: string;
    title: string;
    type: string;
    date: string;
    content: string;
    description: string;
    link: string;
    member: IMember;
}

export interface ILoginCredentials {
    login: string;
    password: string;
}