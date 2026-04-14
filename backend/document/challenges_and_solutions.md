<!-- @format -->

### 2026-04-14 Prisma 7 与环境变量的配置方式兼容性问题

**1. 问题背景与现象 (Context & Problem):**

- 在执行“步骤09：配置 Prisma 与数据库连接”时，由于默认安装了最新版本的 `prisma` (当前最新为 7.x)，执行 `npx prisma generate` 时抛出了 `Error code: P1012`。
- 报错信息提示：`The datasource property 'url' is no longer supported in schema files.`，要求将连接 URL 移至 `prisma.config.ts`。

**2. 分析与排查过程 (Analysis & Troubleshooting):**

- 尝试按照报错提示，移除了 `schema.prisma` 中的 `url = env("DATABASE_URL")`，并在根目录创建了 `prisma.config.ts`，使用 `@prisma/config` 的 `defineConfig` 进行配置。
- 但由于项目使用了自定义的 `src/config/env.ts` (基于 Zod 的环境变量加载)，在 `prisma.config.ts` 中直接导入应用的环境变量文件时，引发了路径解析错误（`TypeError [ERR_INVALID_ARG_TYPE]: The "paths[1]" argument must be of type string`）。
- 考虑到 Prisma 7 仍处于非常新的阶段（引入了较大的配置重构），为了项目的稳定性和团队的熟悉度，决定降级回成熟稳定的 Prisma 6 版本。

**3. 最终解决方案 (Solution):**

- 删除了 `prisma.config.ts`。
- 恢复了 `schema.prisma` 中的传统的 `url = env("DATABASE_URL")` 写法。
- 卸载了 `@prisma/client` 和 `prisma` 的 7.x 版本，执行 `npm i prisma@6 @prisma/client@6` 将版本锁定在稳定的 6.x 版本。
- 重新执行 `npx prisma generate`，成功生成 Client 代码。
