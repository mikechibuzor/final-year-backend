import {Request, Response, NextFunction, Router} from "express"
import { AuthService } from "./auth.service"
import { Controller } from "../../utils/interfaces/controller.interface"


export class AuthController implements Controller{

  public path = "/auth"
  public router = Router() 
  private static instance: AuthController

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, this.register)
    this.router.post(`${this.path}/verify-email`, this.verify)
    this.router.post(`${this.path}/set-password`, this.setPassword)
    this.router.post(`${this.path}/login`, this.login)
    this.router.post(`${this.path}/forget-password`, this.forgetPassword)
    this.router.post(`${this.path}/reset-password`, this.resetPassword)
    this.router.post(`${this.path}/resend-link`, this.resendLink)
    this.router.delete(`${this.path}/delete-user`, this.deleteUser)

  }

  private constructor () {
    this.initializeRoutes()
  } 

  public static getInstance() : AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance
  }

  public async register(req: Request, res: Response, next: NextFunction): Promise<Response | any> {
    try {
      await AuthService.register(req.body);
      return res.status(201).json({message: "Your account has been created. Head over to your email inbox and verify your email"})
    } catch (error) {
      next(error)
    }
  }

  public async verify(req: Request, res: Response, next: NextFunction): Promise<Response | any> {
    try {
      await AuthService.verify(req.body);
      return res.json({message: "Your account has been verified"})
    } catch (error) {
      next(error)
    }
  }

  public async setPassword(req: Request, res: Response, next: NextFunction): Promise<Response | any> {
    try {
      await AuthService.setPassword(req.body)
      res.json({message: "Success. You can over to the login page now"})
    } catch (error) {
      next(error)
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<Response | any> {
    try {
      const { acessTokenJWT, refreshTokenJWT } = await AuthService.login(req.body);
      return res.json({message: "Login successful", acessTokenJWT,refreshTokenJWT})
    } catch (error) {
      next(error)
    }
  }

public async forgetPassword(req: Request, res: Response, next: NextFunction): Promise<Response | any> {
  try {
    await AuthService.forgotPassword(req.body)
    return res.json({message: "An email has been sent to you. Follow the link provided to reset your password"})
  } catch (error) {
    next(error)
  }
}

public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response | any> {
  try {
    await AuthService.resetPassword(req.body)
    return res.json({message: "Password reset successful"})
  } catch (error) {
    next(error)
  }
}

public async resendLink(req: Request, res: Response, next: NextFunction): Promise<Response | any> {
  try {
    await AuthService.resendLink({...req.body, type: req.query.type})
    return res.json({message: "Email sent. Please check your inbox"})
  } catch (error) {
    next(error)
  }
}

public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<Response | any> {
  try {
    await AuthService.deleteUser(req.body)
    return res.json({message: "User deleted"})
  } catch (error) {
    next(error)
  }
}
}