// validateRequest.ts (middleware)
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ZodType } from "zod";


const validateRequest = (schema:ZodType) =>
  catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    await schema.parseAsync({ body: req.body });
    next();
  });

export default validateRequest;