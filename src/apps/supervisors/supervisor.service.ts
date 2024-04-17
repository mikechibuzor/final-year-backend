import db from "../../database/models"
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../utils/error.utils"
import { ISupervisorDetails } from "./supervisor.interface"
const { Supervisor } = db.sequelize.models

export class SupervisorService {

  public static async addSupervisor(params: ISupervisorDetails) {
    try {
      if (!params.title || !params.initials || !params.lastName) throw new BadRequestError("Please provide all required fields")
      const supervisor = await Supervisor.create({
        title: params.title,
        initials: params.initials,
        lastName: params.lastName
      })
      return supervisor
    } catch (error) {
      throw error
    }
  }

  public static async getSupervisor() {
    try {
      const supervisors = await Supervisor.findAll()
      return supervisors
    } catch (error) {
      throw error
    }
  }

  public static async editSupervisor(params: ISupervisorDetails) {
    try {
      if (!params.id) throw new BadRequestError("Please provide supervisor id")
      if (!params.title && !params.initials && !params.lastName) throw new BadRequestError("No valid field provided for editing")
      const supervisor = await Supervisor.findByPk(params.id)
      if (!supervisor) throw new NotFoundError("Supervisor not found")
      if (params.title) supervisor.title = params.title
      if (params.initials) supervisor.initials = params.initials
      if (params.lastName) supervisor.lastName = params.lastName
      await supervisor.save()
      return supervisor
    } catch (error) {
      throw error
    }
  }

}