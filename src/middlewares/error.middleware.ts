import { NextFunction, Request, Response } from "express"
import { CustomError } from "../utils/error.utils"

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  const errorMessages = []
  if (err.name && err.name.startsWith('Sequelize')) {

    if (err.name == "SequelizeUniqueConstraintError") {
      for (const error of err.errors) {
        errorMessages.push(error.message)
      }
      return res.status(400)
        .json({errorMessage: errorMessages.join("; ")})
    }

    if (err.name == "SequelizeValidationError") {
      for (const error of err.errors) {
        errorMessages.push(error.message)
      }
      return res.status(400)
        .json({errorMessage: errorMessages.join("; ")})
    }

    if (err.name == "SequelizeForeignKeyConstraintError") {
      return res.status(400)
        .json({errorMessage: err.parent.detail})
    }

    if (err.name == "SequelizeDatabaseError") {
      if (err.parent && err.parent.routine == 'string_to_uuid') {
        return res.status(400)
          .json({errorMessage: "the id you provided is not a valid uuid. Please re-check"})
      }
    }
  }

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({errorMessage: err.message})
  }

  res.status(500).json({errorMessage: "Something went wrong"})
}