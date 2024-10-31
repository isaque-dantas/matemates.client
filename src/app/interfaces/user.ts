export interface User {
  name: string;
  email: string;
  username: string;
  isStaff: boolean;
}

export interface UserToSend {
  name: string;
  email: string;
  password: string;
  username: string;
  profileImageBase64: string | null;
}

export interface LoginData {
  email: string,
  password: string
}
