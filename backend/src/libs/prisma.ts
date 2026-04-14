import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';
import { logger } from './logger';

// 实例化 Prisma Client
// 在开发环境下打印 query 级别日志，便于调试 SQL
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

/**
 * 检查数据库连接状态
 * 用于服务启动时的健康检查，如果无法连接数据库，服务将启动失败或给出明确报错
 */
export const checkDatabaseConnection = async (): Promise<void> => {
  try {
    // 执行一个最简单的查询来验证连接
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connection established successfully.');
  } catch (error) {
    logger.error({ err: error }, 'Failed to connect to the PostgreSQL database.');
    throw error;
  }
};
