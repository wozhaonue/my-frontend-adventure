import { Request, Response, NextFunction } from 'express';
import { AppError } from '../libs/errors';
import { logger } from '../libs/logger';
import { env } from '../config/env';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  // 如果错误是自定义的 AppError（业务错误、参数错误）
  if (err instanceof AppError) {
    logger.warn({
      msg: 'Operational Error',
      error: err.message,
      errorCode: err.errorCode,
      path: req.path,
      method: req.method,
    });

    res.status(err.statusCode).json({
      status: 'error',
      code: err.errorCode,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
    return;
  }

  // 如果是未预料的系统级/第三方内部错误 (500)
  logger.error({
    msg: 'Unhandled Internal Error',
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    // 在生产环境中屏蔽敏感信息，开发环境可以带上错误信息便于调试
    message: env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message || 'Internal Server Error',
  });
};
