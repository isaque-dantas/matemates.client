export interface User {
  name: string;
  email: string;
  username: string;
  is_staff: boolean;
}

export interface UserToSend {
  name: string;
  email: string;
  password: string;
  username: string;
  profileImageBase64: string | null;
}

export interface LoginData {
  username: string,
  password: string
}
