import { Controller } from "../../utils/interfaces/controller.interface"
import {Request, Response, NextFunction, Router} from "express"
import { SupervisorService } from "./supervisor.service"
import { authenticator, isAdmin } from "../../middlewares/auth.middleware"

export class SupervisorController implements Controller {

  public path = "/supervisors"
  public router = Router() 
  private static instance: SupervisorController

  private initializeRoutes() {
    this.router.route(`${this.path}`).get(authenticator, this.getSupervisors).post(authenticator, isAdmin, this.addSupervisor)
    this.router.patch(`${this.path}/supervisorId`, authenticator, isAdmin, this.editSupervisor)
  }

  private constructor () {
    this.initializeRoutes()
  }

  public static getInstance() : SupervisorController {
    if (!SupervisorController.instance) {
      SupervisorController.instance = new SupervisorController();
    }
    return SupervisorController.instance
  }

  public async addSupervisor(req: Request, res: Response, next: NextFunction): Promise<Response | any> {
    try {
      const supervisor = await SupervisorService.addSupervisor(req.body);
      return res.json({message: "Supervisor successfully added", supervisor})
    } catch (error) {
      next(error)
    }
  }

  public async editSupervisor(req: Request, res: Response, next: NextFunction): Promise<Response | any> {
    try {
      const supervisor = await SupervisorService.editSupervisor({...req.body, id: req.params.supervisorId});
      return res.json({message: "Supervisor successfully updated", supervisor})
    } catch (error) {
      next(error)
    }
  }

  public async getSupervisors(req: Request, res: Response, next: NextFunction): Promise<Response | any> {
    try {
      const supervisors = await SupervisorService.getSupervisor();
      return res.json(supervisors)
    } catch (error) {
      next(error)
    }
  }
}