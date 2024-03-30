import db from "../../database/models"
import { generateMagicLink } from "../../utils/code.utils"
import { BadRequestError, UnauthenticatedError } from "../../utils/error.utils"
import { sendResetPasswordMail, sendVerificationMail } from "../../utils/mail.utils"
import { IEmailPassword, ILoginReturnVal, IEmail, IPasswordId, ICodeId, ICodeIdPass, IEmailAction } from "./auth.interface"
import { compareSync } from "bcryptjs"
import { generate } from "otp-generator"
import { extractTokenUser, generateTokens } from "../../utils/token.util"
const { User, Token } = db.sequelize.models
const REGISTER = "register"
const RESET_PASSWORD = "reset_password"
export class AuthService {
  
  public static async register(params: IEmail): Promise<void> {
    try {
      const user = await User.create({email: params.email?.trim()?.toLowerCase()})
      await this.sendLink(user, REGISTER)
    } catch (error) {
      throw error
    }
  }

  public static async verify(params: ICodeId): Promise<void> {
    try {
      const user = await User.findOne({where: {id: params.id, code: params.code}});
      if (!user) throw new BadRequestError(`Invalid code`);
      if (user.isVerified) throw new BadRequestError("Account already verified. Please head over to the login page");
      if (Date.now() > user.codeExpDate.getTime()) throw new BadRequestError(`Invalid code`);
      user.isVerified = true;
      user.code = null;
      user.codeExpDate = null;
      await user.save();
      return;
    } catch (error) {
      throw error
    }
  }

  public static async setPassword(params: IPasswordId): Promise<void> {
    try {
      const user = await User.findByPk(params.id)
      if (!user) throw new BadRequestError("User deos not exist");
      user.password = params.password
      await user.save()
    } catch (error) {
      throw error
    }
  }

  public static async login(params: IEmailPassword): Promise<ILoginReturnVal> {
    try {
      if (!params.email || !params.password) throw new BadRequestError("Please provide email and password")
      const user = await User.findOne({ where: { email: params.email?.trim()?.toLowerCase() }})
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

  public static async forgotPassword(params: IEmail) {
    try {
      if (!params.email) throw new BadRequestError("Email not provided")
      const user = await User.findOne({where: {email: params.email?.trim()?.toLowerCase()}})
      if (!user) return
      await this.sendLink(user, RESET_PASSWORD)
    } catch (error) {
      throw error
    }
  }

  public static async resetPassword(params: ICodeIdPass) {
    try {
      if (!params.code || !params.password || params.id) throw new BadRequestError("Please provide valid input")
      const user = await User.findOne({where: {id: params.id, code: params.code}});
      if (!user) throw new BadRequestError(`Invalid code`);
      if (!user.isVerified) throw new BadRequestError("Password reset failed on unverified account");
      if (Date.now() > user.codeExpDate.getTime()) throw new BadRequestError(`Invalid code`);
      user.isVerified = true;
      user.code = null;
      user.codeExpDate = null;
      user.password = params.password;
      await user.save();
    } catch (error) {
      throw error
    }
  }

  public static async resendLink(params: IEmailAction) {
    try {
      if (!params.email || !params.action) throw new BadRequestError("Please provide valid input")
      const user = User.findOne({where: {email: params.email}})
      if (!user) return
      await this.sendLink(user, params.action)
    } catch (error) {
      throw error
    }
  }


  private static async sendLink(user: any, action: string) {
    try {
      const { code, magicLink } = generateMagicLink(user.id, action)
      user.code = code;
      user.codeExpDate = new Date(Date.now() + 10 * 60 * 1000);
      await user.save()
      if (action == REGISTER) sendVerificationMail({to: user.email, magicLink})
      else if (action == RESET_PASSWORD) sendResetPasswordMail({to: user.email, magicLink})
      console.log({id: user.id, code})
    } catch (error) {
      throw error
    }
  }
}