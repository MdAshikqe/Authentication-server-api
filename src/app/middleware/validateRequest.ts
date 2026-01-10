import { NextFunction, Request, Response } from "express";
import { RunningCodeInNewContextOptions } from "vm";
import { AnyZodObject } from "zod/v3";

const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
      });
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
