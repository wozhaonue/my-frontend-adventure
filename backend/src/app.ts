import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { z } from 'zod';
import { env } from './config/env';
import { logger } from './libs/logger';
import { BadRequestError } from './libs/errors';
import { errorHandler } from './middlewares/error.middleware';
import { validate } from './middlewares/validate.middleware';

// 创建 Express 应用实例
const app = express();

// 1. 安全头中间件
app.use(helmet());

// 2. 跨域策略中间件
// 根据环境变量配置允许的源，支持逗号分隔的多个源
const allowedOrigins = env.CORS_ORIGIN.split(',').map(origin => origin.trim());

app.use(cors({
  origin: (origin, callback) => {
    // 放行没有 origin 的请求 (如 curl 命令行请求) 或同源请求
    if (!origin || env.CORS_ORIGIN === '*' || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // 允许携带 Cookie/凭证
}));

// 3. 请求体解析中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. 请求日志中间件
app.use(pinoHttp({ logger }));

// 健康检查接口
// 路径: /api/health
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Frontend Quest API is running smoothly.',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// 测试专用路由：用于触发不同类型的错误以验证 errorHandler
// 仅在非生产环境生效，防止生产环境被误调
if (env.NODE_ENV !== 'production') {
  // 验证中间件测试接口
  app.post('/api/test-validation', validate({
    body: z.object({
      username: z.string().min(3, '用户名至少需要3个字符'),
      age: z.number().int().min(18, '年龄必须大于等于18岁'),
      email: z.string().email('必须是有效的邮箱地址').optional(),
    }),
    query: z.object({
      includeProfile: z.string().optional(),
    }),
  }), (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Validation passed',
      data: {
        body: req.body,
        query: req.query,
      }
    });
  });

  app.get('/api/test-error/bad-request', () => {
    throw new BadRequestError('Invalid input parameters');
  });

  app.get('/api/test-error/internal', () => {
    throw new Error('Database connection failed or undefined variable accessed');
  });
}

// 未匹配路由的默认处理
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route not found: ${req.originalUrl}`,
  });
});

// 5. 全局错误处理中间件 (必须放在所有路由和中间件的最后)
app.use(errorHandler);

export default app;
