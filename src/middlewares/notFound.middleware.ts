import { Request, Response } from "express";

export function notFound  (req: Request, res: Response) {
  const baseURL = process.env.NODE_ENV === "production" ? 
  "https://crop2cash-assessment.onrender.com" : "http://localhost:3000"
  res.status(404).send(
    `<center><h1>This resource could not be found. Check out the documentation for the API <a href=#>here</a></h1></center>`
    );
}