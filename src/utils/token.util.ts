import jwt from "jsonwebtoken"
import { ITokenUser } from "../apps/auth/auth.interface";

export const generateTokens = ({user, refreshToken}: {user: ITokenUser; refreshToken: string}) => {
  const acessTokenJWT = jwt.sign(user, process.env.JWT_SECRET || "", { expiresIn: "24h" });
  const refreshTokenJWT = jwt.sign({ user, refreshToken }, process.env.JWT_SECRET || "", { expiresIn: "30d" });
  return { acessTokenJWT, refreshTokenJWT }
}

export const decodeToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET || "");

export const extractTokenUser = (user: ITokenUser) => {
  const email = user.email;
  const role = user.role;
  const userId = user.userId;

  return {  email, role, userId };
};