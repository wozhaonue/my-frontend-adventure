# 前端冒险（Backend）技术栈建议（最简单且最健壮）

## 1. 结论（推荐落地方案）

为匹配 `backend_design.md` 的功能目标，并兼顾**实现成本最低**与**长期稳定性最高**，推荐采用下面这套后端技术栈：

- **运行时与语言**：Node.js 20 LTS + TypeScript
- **Web 框架**：Express.js
- **数据库**：PostgreSQL
- **ORM**：Prisma
- **缓存与短期状态**：Redis
- **认证**：JWT（`jsonwebtoken`）+ `bcrypt`
- **请求校验**：Zod
- **定时任务**：node-cron
- **安全中间件**：helmet + cors + express-rate-limit
- **日志**：Pino
- **配置管理**：dotenv（配合环境变量分层）
- **测试**：Vitest + Supertest
- **部署**：Docker + Docker Compose（单机/轻量云主机优先）

---

## 2. 为什么这是“最简单且最健壮”

- **Express 学习与维护成本最低**：生态成熟，团队上手快，适合当前从 0 到 1 的后端搭建。
- **PostgreSQL + Prisma 稳定且类型友好**：关系清晰，适合用户、技术、关卡的一对多结构；Prisma 减少 SQL 维护复杂度并提升类型安全。
- **Redis 天然匹配验证码登录流程**：验证码与轮询状态是短时数据，放 Redis 最简单、最快、最可靠。
- **Zod 在入口层兜底**：对 webhook、AI 生成、关卡导入等输入做强校验，降低脏数据风险。
- **node-cron 满足当前“90 天未登录注销”需求**：无需引入更重的任务系统，先简单落地。
- **Pino + 统一错误处理中间件**：快速定位问题，支持后续生产环境排障。

---

## 3. 与设计文档功能的一一映射

- **公众号验证码登录**：Express 路由 + Redis 存验证码状态 + JWT 发令牌。
- **90 天自动注销**：node-cron 每日扫描 PostgreSQL 并更新 `is_deactivated`。
- **固定技术模块（HTML/CSS/JS/TS/Vue/React）**：PostgreSQL 字典表 + Prisma seed 初始化。
- **关卡顺序调整**：Prisma 事务批量更新 `order_index`，保证重排一致性。
- **AI 生成关卡**：后端仅调用 LLM 并返回预览，用户确认后再写入 PostgreSQL。

---

## 4. 最小可用依赖清单（MVP）

```txt
express
typescript
ts-node-dev
prisma
@prisma/client
pg
redis
jsonwebtoken
bcrypt
zod
node-cron
helmet
cors
express-rate-limit
pino
pino-http
dotenv
vitest
supertest
```

---

## 5. 工程结构建议（保持简单）

```txt
backend/
  src/
    app.ts
    server.ts
    config/
    middlewares/
    modules/
      users/
      wechat/
      techs/
      levels/
      ai/
    jobs/
    libs/
      prisma.ts
      redis.ts
      logger.ts
  prisma/
    schema.prisma
    seed.ts
```

---

## 6. 关键实现原则（保证健壮）

- 所有 API 入参先做 Zod 校验，再进入业务层。
- JWT 只存最小必要字段（如 `userId`），避免冗余与泄露风险。
- 对 `reorder`、`import level` 使用数据库事务。
- 对外部依赖（微信回调、LLM）加超时、重试与错误分级。
- 所有敏感配置仅走环境变量，不入库、不打印。
- 登录、轮询、Webhook 接口增加速率限制与基础审计日志。

---

## 7. 明确不推荐（当前阶段）

- **不建议直接上 NestJS**：规范强但初期样板代码较多，增加启动复杂度。
- **不建议引入消息队列（Kafka/RabbitMQ）**：当前业务规模不需要，会显著增加运维复杂度。
- **不建议微服务化**：单体模块化即可满足当前需求，后续再按瓶颈拆分。

---

## 8. 版本建议

- Node.js：20.x LTS
- PostgreSQL：15.x 或 16.x
- Redis：7.x
- Prisma：5.x+
- TypeScript：5.x

该版本组合在社区与生产实践中成熟度高，兼顾稳定性与长期维护性。
