import app from './app';
import { env } from './config/env';
import { checkDatabaseConnection, prisma } from './libs/prisma';
import { logger } from './libs/logger';

// 定义启动服务的异步函数
async function bootstrap() {
  try {
    // 启动前检查数据库连接，若无法连接将抛出异常并阻止服务启动
    await checkDatabaseConnection();

    // 启动 HTTP 服务
    const port = env.PORT || 3000;
    
    const server = app.listen(port, () => {
      console.log('✅ ========================================');
      console.log(`✅  Frontend Quest Backend is running!`);
      console.log(`✅  Environment: ${env.NODE_ENV}`);
      console.log(`✅  Port: ${port}`);
      console.log(`✅  Health Check: http://localhost:${port}/api/health`);
      console.log('✅ ========================================');
    });
    
    // 优雅停机处理 (Graceful Shutdown)
    const gracefulShutdown = async (signal: string) => {
      console.log(`${signal} signal received: closing HTTP server and database connections`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// 执行启动
bootstrap();
