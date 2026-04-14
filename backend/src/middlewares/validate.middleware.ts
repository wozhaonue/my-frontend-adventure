import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { BadRequestError } from '../libs/errors';

/**
 * Zod validation middleware for Express
 * Validates request body, query, and params against provided Zod schemas.
 */
export const validate = (schema: {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        const parsedBody = await schema.body.parseAsync(req.body);
        Object.defineProperty(req, 'body', { value: parsedBody, writable: true, enumerable: true, configurable: true });
      }
      if (schema.query) {
        const parsedQuery = await schema.query.parseAsync(req.query);
        Object.defineProperty(req, 'query', { value: parsedQuery, writable: true, enumerable: true, configurable: true });
      }
      if (schema.params) {
        const parsedParams = await schema.params.parseAsync(req.params);
        Object.defineProperty(req, 'params', { value: parsedParams, writable: true, enumerable: true, configurable: true });
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Extract validation error messages
        const errorMessages = error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        
        // Throw our standard BadRequestError with the validation details
        next(new BadRequestError('请求参数校验失败', errorMessages));
      } else {
        console.error('Validation error not instance of ZodError:', error);
        next(error);
      }
    }
  };
};
