// validateRequest.ts (middleware)
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ZodType } from "zod";

type ParsedRequest = {
  body?: unknown;
  query?: Record<string, unknown>;
  params?: Record<string, string>;
};

const validateRequest = (schema:ZodType) =>
  catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as ParsedRequest;

    if (parsed.body !== undefined) req.body = parsed.body;
    if (parsed.query !== undefined) Object.assign(req.query, parsed.query);
    if (parsed.params !== undefined) Object.assign(req.params, parsed.params);

    next();
  });

export default validateRequest;