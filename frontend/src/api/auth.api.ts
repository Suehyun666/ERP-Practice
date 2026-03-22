import api from './client';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthUser {
  userId: number;
  username: string;
  displayName: string;
}

export const login = async (payload: LoginPayload): Promise<AuthUser> => {
  const { data } = await api.post<AuthUser>('/auth/login', payload);
  return data;
};

export interface SignupPayload {
  username: string;
  password: string;
  displayName: string;
  email: string;
}

export const signup = async (payload: SignupPayload): Promise<AuthUser> => {
  const { data } = await api.post<AuthUser>('/auth/signup', payload);
  return data;
};
