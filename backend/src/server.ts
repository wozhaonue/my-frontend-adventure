import app from './app';
import { env } from './config/env';

// 定义启动服务的异步函数
async function bootstrap() {
  try {
    // 启动 HTTP 服务
    const port = env.PORT || 3000;
    
    app.listen(port, () => {
      console.log('✅ ========================================');
      console.log(`✅  Frontend Quest Backend is running!`);
      console.log(`✅  Environment: ${env.NODE_ENV}`);
      console.log(`✅  Port: ${port}`);
      console.log(`✅  Health Check: http://localhost:${port}/api/health`);
      console.log('✅ ========================================');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// 优雅停机处理 (Graceful Shutdown)
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// 执行启动
bootstrap();
