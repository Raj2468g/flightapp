export interface User {
    _id?: string;
    username: string;
    password: string;
    name: string;
    email: string;
    role: 'user';
  }