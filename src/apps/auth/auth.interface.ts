
export interface IRegister {
  email: string;
}

export interface IVerify {
  id: string;
  code: string
}

export interface ISetPassword {
  id: string;
  password: string;
}

export interface ILogin {
  email: string;
  password: string
}

export interface ILoginReturnVal {
  acessTokenJWT: string;
  refreshTokenJWT: string;
}

export interface ITokenUser {
  email: string;
  userId: string;
  role: string;
}
