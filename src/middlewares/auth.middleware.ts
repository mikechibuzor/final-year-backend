import { NextFunction, Request, Response } from "express";
import { UnauthenticatedError, UnauthorizedError } from "../utils/error.utils";
import { decodeToken } from "../utils/token.util";


export const authenticator = (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer "))
    throw new UnauthenticatedError("Authentication failed. Please login to continue");

    const token = req.headers.authorization.split(" ")[1];
    const user: any = decodeToken(token);
    req.user = {
      userId: user.userId,
      role: user.role,
      email: user.email
    }
    next()
  } catch(err) {
    next(err)
  }

}

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.user.role !== "admin") throw new UnauthorizedError("You ae not allowed to perform this operation")
    next()
  } catch (error) {
    next(error)
  }
}