import { Controller } from "../../utils/interfaces/controller.interface"
import {Request, Response, NextFunction, Router} from "express"
import { authenticator } from "../../middlewares/auth.middleware"
import { BookmarkService } from "./bookmark.service"

export class BookmarkController implements Controller {
  public path = "/bookmarks"
  public router = Router() 
  private static instance: BookmarkController

  private initializeRoutes() {
    this.router.get(`${this.path}`, authenticator, this.getBookmarks)
    this.router.route(`${this.path}/:projectId`).delete(authenticator, this.deleteBookmark).post(authenticator, this.addBookmark)
  }

  private constructor() {
    this.initializeRoutes()
  }
  
  public static getInstance() : BookmarkController {
    if (!BookmarkController.instance) {
      BookmarkController.instance = new BookmarkController();
    }
    return BookmarkController.instance
  }

  public async addBookmark(req: any, res: Response, next: NextFunction): Promise<Response | any> {
    try {
      const bookmark = await BookmarkService.addBookmark({...req.params, userId: req.user.userId })
      return res.json({message: "Bookmarked", bookmark})
    } catch (error) {
      next(error)
    }
  }

  public async getBookmarks(req: any, res: Response, next: NextFunction): Promise<Response | any> {
    try {
      const bookmarks = await BookmarkService.getBookmarks(req.user.userId)
      return res.json(bookmarks);
    } catch (error) {
      next(error)
    }
  }

  public async deleteBookmark(req: any, res: Response, next: NextFunction): Promise<Response | any> {
    try {
      await BookmarkService.deleteBookmark({...req.params, userId: req.user.userId})
      return res.json({message: "Unbookmarked" })
    } catch (error) {
      next(error)
    }
  }

}