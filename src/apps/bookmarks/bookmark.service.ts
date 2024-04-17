import db from "../../database/models"
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../utils/error.utils"
import { IUserBookmark, IUserProject } from "./bookmark.interface"
const { Bookmark } = db.sequelize.models

export class BookmarkService {
  
  public static async addBookmark(params: IUserProject) {
    try {
      if (!params.userId || params.projectId) throw new BadRequestError("userId or/and projectId not provided")
      const bookmark = await Bookmark.create(params)
      return bookmark
    } catch (error) {
      throw error
    }
  }

  public static async deleteBookmark(params: IUserBookmark) {
    try {
      if (!params.bookmarkId || !params.userId) throw new BadRequestError("bookmark or/and user id not provided")
      const bookmark = await Bookmark.findByPk(params.bookmarkId)
      if (!bookmark) throw new NotFoundError("Bookmark not found")
      if (bookmark.userId != params.userId) throw new UnauthorizedError("You are not allowed to perform this operation")
      await bookmark.destroy()
    } catch (error) {
      throw error
    }
  }

  public static async getBookmarks(userId: string) {
    try {
      if (!userId) throw new BadRequestError("Please provide user's id")
      const bookmarks = await Bookmark.findAll({where: {userId}})
      return bookmarks
    } catch (error) {
      throw error
    }
  }
  
}