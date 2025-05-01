export interface User {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  phone: string;
  gender: string;
  role: 'admin' | 'user';
  createdAt: string;
}