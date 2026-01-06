import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { Prisma } from "../../../generated/prisma/client";

const globalErrorHandaler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let httpCode = status.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong";
  let error = err;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      message = "Not found";
      error = err.meta;
    }
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      message = "Duplicate key error";
      error = err.meta;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    message = "Validation error in Prisma query";
    error = err.message;
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    httpCode = status.INTERNAL_SERVER_ERROR;
    message = "Database connection failed";
    error = err.message;
  }

  if (err.name === "ZodError") {
    message = "Invalid request data";
    error = err.errors || err.issues;
  }
  if (err instanceof SyntaxError && "body" in err) {
    message = "Invalid JSON in request body";
    error = err.message;
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        message = "Duplicate key error (unique constraint failed)";
        error = err.meta;
        break;
      case "P2003":
        message = "Foreign key constraint failed";
        error = err.meta;
        break;
      case "P2025":
        message = "Record not found";
        error = err.meta;
        break;
      default:
        message = `Database error: ${err.code}`;
        error = err.meta;
        break;
    }
  }
  res.status(httpCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandaler;
