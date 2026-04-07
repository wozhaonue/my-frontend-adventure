import pino from 'pino';
import { env } from '../config/env';

export const logger = pino({
  level: env.LOG_LEVEL || 'info',
  // 在开发环境下，如果需要更好的格式化输出可以安装 pino-pretty，
  // 但为了满足“最简依赖”规则，这里默认使用标准的 pino 输出格式。
  // 若需漂亮输出可取消下面 transport 的注释并 npm install -D pino-pretty
  /*
  transport: env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
    },
  } : undefined,
  */
});
