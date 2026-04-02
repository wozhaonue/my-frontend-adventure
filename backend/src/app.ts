import express from 'express';
import { env } from './config/env';

// 创建 Express 应用实例
const app = express();

// 基础中间件 (暂时只加解析 JSON，其他中间件在步骤 06 中完善)
app.use(express.json());

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
