
export interface IEmail {
  email: string;
}

export interface ICodeId {
  id: string;
  code: string;
}

export interface ICodeIdPass {
  id: string;
  code: string;
  password: string;
}

export interface IPasswordId {
  id: string;
  password: string;
}

export interface IEmailPassword {
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
 
export interface IEmailType {
  email: string;
  type: string;
}