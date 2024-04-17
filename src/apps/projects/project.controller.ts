import { Controller } from "../../utils/interfaces/controller.interface"
import { Request, Response, NextFunction, Router } from "express"
import { ProjectService } from "./project.service"
import { authenticator, isAdmin } from "../../middlewares/auth.middleware"
import project from "../../database/models/project"
import { upload } from "../../middlewares/upload.middleware"

export class ProjectController implements Controller {

  public path = "/projects"
  public router = Router()
  private static instance: ProjectController

  private initializeRoutes() {
    this.router.route(`${this.path}`).get(authenticator, this.getAllProjects).post(authenticator, isAdmin, upload.fields([{name: 'projectDoc'}]), this.uploadProject)
    this.router.route(`${this.path}/:projectId`).get(authenticator, this.getProject)
      .patch(authenticator, isAdmin, upload.fields([{name: 'projectDoc'}]), this.updateProject).delete(authenticator, isAdmin, this.deleteProject)
  }

  private constructor() {
    this.initializeRoutes()
  }

  public static getInstance(): ProjectController {
    if (!ProjectController.instance) {
      ProjectController.instance = new ProjectController();
    }
    return ProjectController.instance
  }

  public async uploadProject(req: Request, res: Response, next: NextFunction): Promise<Response | any> {
    try {
      const { projectDoc } = req.files as { [fieldname: string]: Express.Multer.File[] };
      const project = await ProjectService.uploadProject({ ...req.body, projectDoc });
      return res.json({ message: "Image successfully uploaded", project })
    } catch (error) {
      next(error)
    }
  }

  public async getAllProjects(req: Request, res: Response, next: NextFunction): Promise<Response | any> {
    try {
      const projects = await ProjectService.getAllProjects()
      return res.json(projects)
    } catch (error) {
      next(error)
    }
  }

  public async getProject(req: Request, res: Response, next: NextFunction): Promise<Response | any> {
    try {
      const project = await ProjectService.getProject({ projectId: req.params.projectId })
      return res.json(project)
    } catch (error) {
      next(error)
    }
  }

  public async deleteProject(req: Request, res: Response, next: NextFunction): Promise<Response | any> {
    try {
      await ProjectService.deleteProject({ projectId: req.params.projectId })
      return res.json({ message: "Project successfully deleted" })
    } catch (error) {
      next(error)
    }
  }

  public async updateProject(req: Request, res: Response, next: NextFunction): Promise<Response | any> {
    try {
      const project = await ProjectService.updateProject({ ...req.body, projectId: req.params.projectId })
      return res.json({ message: "Project updated successfully", project })
    } catch (error) {
      next(error)
    }
  }

}