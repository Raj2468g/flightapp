export interface User {
  _id: string;
  id: string;
  username: string;
  password: string;
  name?: string; // Optional to avoid backend changes
  email: string;
  role: string;
}