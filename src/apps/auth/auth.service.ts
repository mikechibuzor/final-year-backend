import db from "../../database/models"
import { generateMagicLink } from "../../utils/code.utils"
import { BadRequestError, UnauthenticatedError, UnauthorizedError } from "../../utils/error.utils"
import { sendResetPasswordMail, sendVerificationMail } from "../../utils/mail.utils"
import { IEmailPassword, ILoginReturnVal, IEmail, IDetails, ICodeId, ICodeIdPass, IEmailType } from "./auth.interface"
import { compareSync } from "bcryptjs"
import { generate } from "otp-generator"
import { config } from "dotenv"
import { extractTokenUser, generateTokens } from "../../utils/token.util"
const { User, Token, Project } = db.sequelize.models
config()
const REGISTER = "create-account"
const RESET_PASSWORD = "reset-password"

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

  public static async setDetails(params: IDetails): Promise<void> {
    try {
      if (!params.password || !params.username) throw new BadRequestError("Please provide both username and password")
      const user = await User.findByPk(params.id)
      if (!user) throw new BadRequestError("User deos not exist");
      if (!user.isVerified) throw new BadRequestError("Your account has not been verified")
      user.password = params.password
      user.username = params.username
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
      const userDetails = {
        email: user.email,
        username: user.username,
        role: user.role
      }
      const projects = await Project.findAll();
      const bookmarks = await user.getProjects({ joinTableAttributes: [] })
      const { acessTokenJWT, refreshTokenJWT } = generateTokens({ user: tokenUser, refreshToken })
      return {acessTokenJWT, refreshTokenJWT, userDetails, bookmarks, projects};
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  public static async forgotPassword(params: IEmail) {
    try {
      if (!params.email) throw new BadRequestError("Email not provided")
      const user = await User.findOne({where: {email: params.email?.trim()?.toLowerCase()}})
      if (!user || !user.isVerified) return
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

  public static async resendLink(params: IEmailType) {
    try {
      if (!params.email || !params.type) throw new BadRequestError("Please provide valid input")
      const user = await User.findOne({where: {email: params.email}})
      if (!user) return
      if (!user.isVerified && params.type == RESET_PASSWORD) throw new BadRequestError("Password reset failed on unverified account");
      await this.sendLink(user, params.type)
    } catch (error) {
      throw error
    }
  }

  public static async deleteUser(params: IEmail) {
    try {
      if (!params.email) throw new BadRequestError("Provide email of user to delete")
      const user = await User.findOne({where: {email: params.email}})
      if (!user) return
      await user.destroy();
    } catch (error) {
      console.log(error)
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

  public static async createAdmin(params: {createAdminCode: string}) {
    try {
      if (!params.createAdminCode) throw new BadRequestError("Provide valid input")
      if (params.createAdminCode != process.env.CREATE_ADMIN_CODE) throw new UnauthorizedError("You are not allowed to create an admin")
      await User.create({
        email: 'admin1@stu.ui.edu.ng',
        password: process.env.ADMIN_CODE,
        isVerified: true,
        role: 'admin'
      })
    } catch (error) {
      throw error
    }
  }

  public static async adminLogin(params: {code: string}) {
    try {
      if (!params.code) throw new BadRequestError("Provide code")
      const email = 'admin1@stu.ui.edu.ng';
      const admin = await User.findOne({where: {email}})
      if (!admin) throw new UnauthenticatedError("Authentication failed")
      const validPassword = compareSync(params.code, admin.password);
      if (!validPassword) throw new UnauthenticatedError("Authentication failed")
      const refreshToken = generate()
      const token = await Token.create({
        refreshToken,
        userId: admin.id
      })
      const tokenUser = extractTokenUser(admin);
      const { acessTokenJWT, refreshTokenJWT } = generateTokens({ user: tokenUser, refreshToken })
      const adminDetails = {
        email: admin.email,
        username: admin.username,
        role: admin.role
      }
      return { acessTokenJWT, refreshTokenJWT, adminDetails };
    } catch (error) {
      throw error
    }
  }
}