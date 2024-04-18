
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

export interface IDetails {
  id: string;
  password: string;
  username: string;
}

export interface IEmailPassword {
  email: string;
  password: string
}

export interface ILoginReturnVal {
  acessTokenJWT: string;
  refreshTokenJWT: string;
  userDetails: any;
  bookmarks: any;
  projects: any;
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