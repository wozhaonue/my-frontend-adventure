import { env } from './config/env';

console.log('环境变量加载成功！');
console.log(`当前运行环境: ${env.NODE_ENV}`);
console.log(`服务监听端口: ${env.PORT}`);
console.log(`数据库连接: ${env.DATABASE_URL}`);
console.log('✅ TypeScript Compilation Success!');
