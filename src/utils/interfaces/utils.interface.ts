
export interface ISendMail {
  to: string;
  subject: string;
  html: string;
}

export interface IVerificationPasswordResetnMail {
  to: string;
  magicLink: string;
}

export interface IError {
  message: string;
  statusCode: number;
}
