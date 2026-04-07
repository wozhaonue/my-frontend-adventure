import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './libs/logger';

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

// 未匹配路由的默认处理
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route not found: ${req.originalUrl}`,
  });
});

export default app;
