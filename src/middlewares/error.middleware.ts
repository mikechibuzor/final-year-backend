import { NextFunction, Request, Response } from "express"
import { CustomError } from "../utils/error.utils"

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const errorMessages = []
  if (err.name && err.name == "SequelizeValidationError") {
    for (const error of err.errors) {
      errorMessages.push(error.message)
    }
    return res.status(400)
      .json({errorMessages})
  }

  if (err.name && err.name == "SequelizeUniqueConstraintError") {
    for (const error of err.errors) {
      errorMessages.push(error.message)
    }
    return res.status(400)
      .json({errorMessages})
  }

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({errorMessage: err.message})
  }

  res.status(500).json({err})
}