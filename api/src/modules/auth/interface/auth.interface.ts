export interface RegistrationStatus {
  success: boolean;
  message: string;
}

export interface JwtPayload {
  username: string;
}

export interface LoginStatus {
  username: string;
  accessToken: string;
  refreshToken: string;
}

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
