import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// 根据 NODE_ENV 加载对应的 .env 文件
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = `.env.${nodeEnv}`;

// 忽略 dotenv 的默认打印信息 (quiet)
// 但 dotenv v16.4+ 实际上并不接受 quiet 作为类型，它可能是某些其他库的行为（如 c12/dotenv）
// 我们只使用基本的 dotenv.config
const envConfig = dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// 如果特定环境的 .env 文件不存在，回退到基础的 .env 文件
if (envConfig.error) {
  dotenv.config();
}

// 定义环境变量的 Schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('3000'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'), // 前端允许跨域的地址
  
  // 数据库
  DATABASE_URL: z.string().url('必须是有效的数据库连接字符串'),
  
  // Redis
  REDIS_URL: z.string().url('必须是有效的 Redis 连接字符串'),
  
  // JWT
  JWT_SECRET: z.string().min(16, 'JWT_SECRET 至少需要 16 个字符'),
  
  // 微信配置 (外部回调)
  WECHAT_TOKEN: z.string().min(1, '微信 Token 不能为空'),
  WECHAT_APP_ID: z.string().optional(), // 暂时设为可选，如果后续主动调用微信接口则需要
  WECHAT_APP_SECRET: z.string().optional(),
  
  // AI 接口配置
  LLM_API_KEY: z.string().min(1, 'AI 大模型 API Key 不能为空'),
  LLM_BASE_URL: z.string().url('必须是有效的 API URL').optional(),
});

// 解析并验证环境变量
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ 环境变量校验失败:');
  _env.error.issues.forEach((issue) => {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  });
  // 缺失关键变量时，建立启动失败机制
  process.exit(1);
}

// 导出类型安全的 env 对象
export const env = _env.data;
