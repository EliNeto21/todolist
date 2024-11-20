export type Item = {
    id: number;
    name: string;
    done: boolean;
}

export type Task = {
    name: string;
    content: string;
    done: boolean;
    userId: number;
}

export type User = {
    name: string;
    email: string;
    password: string;
}

export type Token = {
    email: string;
    password: string;
}