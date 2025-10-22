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
    createdOn: string;
    lastUpdatedOn: string;
    content: string;
    description: string;
    link: string;
    originalPoster: IMember;
}

export interface IStudent {
    id: number;
    campus: string;
    curso: string;
    formaIngresso: string;
    qtdPessoas: number;
    cotas: string;
}

export interface IPage {
    content: [];
    totalPages: number;
}

export interface ILoginCredentials {
    login: string;
    password: string;
}