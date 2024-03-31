import { NextFunction, Request, Response } from "express";
import { UnauthenticatedError } from "../utils/error.utils";
import { decodeToken, extractTokenUser } from "../utils/token.util";


export const authenticator = (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer "))
    throw new UnauthenticatedError("Authentication failed. Please login to continue");

    const token = req.headers.authorization.split(" ")[1];
    const user = decodeToken(token);
    req.user = extractTokenUser(user);
    next()
  } catch(err) {
    next(err)
  }

}