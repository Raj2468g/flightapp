export interface User {
  id: string;
  _id?: string;  // Add the _id property
  username: string;
  password: string;
  name: string;
  email: string;
  role: string;
}