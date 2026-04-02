<!-- @format -->

# 后端架构与文件职责说明

> ⚠️ 核心规则：每新增、删除或重命名任一后端文件，必须同步更新本文档中对应文件的作用说明。每次调整数据库字段或表关系，必须同步更新“数据库结构”章节。

## 1. 目录与文件职责

```txt
backend/
  ├── src/
  │   ├── config/        # 环境变量与全局配置文件
  │   ├── middlewares/   # 全局中间件（安全、错误处理、鉴权等）
  │   ├── modules/       # 业务模块（路由与控制器）
  │   │   ├── users/     # 用户登录、注销、个人信息
  │   │   ├── wechat/    # 微信公众号回调接收与验签
  │   │   ├── techs/     # 技术模块字典列表
  │   │   ├── levels/    # 关卡增删改查与重排
  │   │   └── ai/        # AI 生成关卡预览
  │   ├── jobs/          # 定时任务（如：90天自动注销扫描）
  │   ├── libs/          # 核心外部依赖实例化库（Prisma, Redis, Logger）
  │   ├── app.ts         # Express 应用实例构建（不含监听）
  │   └── server.ts      # HTTP 服务入口与端口监听
  └── prisma/
      ├── schema.prisma  # 数据库结构定义与模型
      └── seed.ts        # 字典数据（技术列表）初始化种子
```

## 2. 数据库结构说明 (基于 PostgreSQL + Prisma)

### `Users` 表
- `id` (UUID): 主键
- `wechat_openid` (String): 微信用户的唯一标识 (唯一索引)
- `wechat_unionid` (String, Optional): 微信开放平台统一标识
- `nickname` (String, Optional): 微信昵称
- `avatar_url` (String, Optional): 微信头像 URL
- `last_login_time` (Timestamp): 最后登录时间，用于判定注销
- `is_deactivated` (Boolean): 是否已注销（软删除字段，默认 false，重新登录可恢复）
- `created_at` (Timestamp): 账号创建时间

### `Technologies` 表
- `id` (String): 主键，直接使用技术标识（如 'html', 'vue'）
- `title` (String): 显示标题
- `desc` (String): 描述文本
- `path` (String): 固定的前端路由路径
- `created_at` (Timestamp): 创建时间

### `Levels` 表
- `id` (UUID): 主键
- `user_id` (UUID, FK, Optional): 关联的用户 ID（若为空且 is_ai_curated 为 true，则为系统级公共关卡）
- `tech_id` (String, FK): 关联的技术配置 ID
- `order_index` (Integer): 关卡排序索引，用于拖拽重排
- `content` (JSONB): 关卡具体内容（含标题、说明、题目配置、初始代码等）
- `is_ai_curated` (Boolean): 是否为 AI 精选公共关卡（默认 false）
- `created_at` (Timestamp): 创建时间
