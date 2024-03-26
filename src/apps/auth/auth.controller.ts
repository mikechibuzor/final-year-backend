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
}