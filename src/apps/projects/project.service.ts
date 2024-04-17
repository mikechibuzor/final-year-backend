import db from "../../database/models"
import supervisor from "../../database/models/supervisor"
import { BadRequestError, NotFoundError } from "../../utils/error.utils"
import { uploadFile } from "../../utils/s3"
import { IProjectId, IProjectDetails } from "./project.interface"
const { Project } = db.sequelize.models


export class ProjectService {

  public static async getAllProjects() {
    try {
      const projects = await Project.findAll()
      return projects
    } catch (error) {
      throw error
    }
  }

  public static async getProject(params: IProjectId) {
    try {
      if (!params.projectId) throw new BadRequestError("Project id not provided")
      const project = await Project.findByPk(params.projectId)
      if (!project) throw new NotFoundError("Project not found")
      return project
    } catch (error) {
      throw error
    }
  }

  public static async deleteProject(params: IProjectId) {
    try {
      if (!params.projectId) throw new BadRequestError("Project id not provided")
      const project = await Project.findByPk(params.projectId)
      if (!project) throw new NotFoundError("Project not found")
      await project.destroy()
    } catch (error) {
      throw error
    }
  }

  public static async updateProject(params: IProjectDetails) {
    try {
      if (!params.projectId) throw new BadRequestError("Project id not provided")
      if (!params.title && !params.matricNo && !params.authorFirstName && !params.authorLastName && !params.supervisorId && !params.projectDoc && !params.year && !params.citation) {
        throw new BadRequestError("No valid field provided for upload")
      }
      const project = await Project.findByPk(params.projectId);
      if (!project) throw new NotFoundError("Project not found")

      if (params.title) project.title = params.title
      if (params.matricNo) project.matricNo = params.matricNo
      if (params.authorFirstName) project.authorFirstName = params.authorFirstName
      if (params.authorLastName) project.authorLastName = params.authorLastName
      if (params.year) project.year = params.year
      if (params.citation) project.citation = params.citation
      if (params.supervisorId) project.supervisorId = params.supervisorId
      if (params.projectDoc) {
        const pdfURL = await uploadFile(params.projectDoc[0])
        project.url = pdfURL
      }
      await project.save()
      return project
    } catch (error) {
      throw error
    }
  }

  public static async uploadProject(params: IProjectDetails) {
    try {
      if (!params.projectDoc) throw new BadRequestError("Project document not provided")
      const pdfURL = await uploadFile(params.projectDoc[0])
      const project = await Project.create({
        title: params.title,
        matricNo: params.matricNo,
        authorFirstName: params.authorFirstName,
        authorLastName: params.authorLastName,
        year: params.year,
        citation: params.citation,
        supervisorId: params.supervisorId,
        url: pdfURL,
      })
      
      return project
    } catch (error) {
      throw error
    }
  }

}