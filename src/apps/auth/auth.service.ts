import db from "../../database/models"
import { generateMagicLink } from "../../utils/code.utils"
import { BadRequestError, UnauthenticatedError } from "../../utils/error.utils"
import { sendVerificationMail } from "../../utils/mail.utils"
import { ILogin, ILoginReturnVal, IRegister, ISetPassword, IVerify } from "./auth.interface"
import { compareSync } from "bcryptjs"
import { generate } from "otp-generator"
import { extractTokenUser, generateTokens } from "../../utils/token.util"
const { User, Token } = db.sequelize.models

export class AuthService {
  
  public static async register(params: IRegister): Promise<void> {
    try {
      const user = await User.create({email: params.email?.trim()?.toLowerCase()})
      const { code, magicLink } = generateMagicLink(user.id)
      user.code = code;
      user.codeExpDate = new Date(Date.now() + 10 * 60 * 1000);
      await user.save()
      sendVerificationMail({to: user.email, magicLink})
      return
    } catch (error) {
      throw error
    }
  }

  public static async verify(params: IVerify): Promise<void> {
    try {
      const user = await User.findOne({wherer: {id: params.id, code: params.code}});
      if (!user) throw new BadRequestError(`Verification failed`);
      if (user.isVerified) throw new BadRequestError("Account already verified. Please head over to the login page");
      if (Date.now() > user.codeExpDate.getTime()) throw new BadRequestError(`Verification failed`);
      user.isVerified = true;
      user.code = null;
      user.codeExpDate = null;
      await user.save();
      return;
    } catch (error) {
      throw error
    }
  }

  public static async setPassword(params: ISetPassword): Promise<void> {
    try {
      const user = await User.findByPk(params.id)
      if (!user) throw new BadRequestError("User deos not exist");
      user.password = params.password
      await user.save()
    } catch (error) {
      throw error
    }
  }

  public static async login(params: ILogin): Promise<ILoginReturnVal> {
    try {
      if (!params.email || !params.password) throw new BadRequestError("Please provide email and password")
      const user = await User.findOne({ where: { email: params.email }})
      if (!user) throw new UnauthenticatedError("Wrong email or password");
      if (!user.isVerified) throw new UnauthenticatedError("Authentication failed")
      const validPassword = compareSync(params.password, user.password);
      if (!validPassword) throw new UnauthenticatedError("Wrong email or password");

      const refreshToken = generate()
      const token = await Token.create({
        refreshToken,
        userId: user.id
      })
      const tokenUser = extractTokenUser(user);
      const { acessTokenJWT, refreshTokenJWT } = generateTokens({ user: tokenUser, refreshToken })
      return {acessTokenJWT, refreshTokenJWT};
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}