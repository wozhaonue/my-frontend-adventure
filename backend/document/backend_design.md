<!-- @format -->

# 前端冒险 (Frontend Quest) - 后端系统设计文档

## 1. 概述 (Overview)

当前前端系统中的关卡（Levels）数据是通过本地静态数组和 Markdown 文件进行管理的（例如 `src/levels/index.ts` 中的 `levelLoaders`）。这种硬编码方式导致扩展性差、无法为不同用户动态定制关卡，且难以进行关卡顺序的灵活调整。
本设计文档旨在规划一个动态的后端服务，通过数据库存储和管理多用户个性化的学习路线（技术模块）与关卡数据。

---

## 2. 技术栈选择 (Technology Stack)

为了与前端 React 生态保持一致性并实现高效开发，后端将采用基于 Node.js 的 JavaScript/TypeScript 技术栈：

- **核心框架**：**Express.js** - 轻量、灵活且成熟的 Node.js Web 应用框架，用于处理 HTTP 路由和中间件。
- **语言**：**TypeScript** - 提供静态类型检查，增强代码的健壮性和可维护性，方便与前端复用类型定义。
- **数据库**：**PostgreSQL** (推荐) 或 **MySQL** - 关系型数据库，非常适合处理带有复杂关联（用户 -> 技术 -> 关卡）的数据结构。
- **ORM (对象关系映射)**：**Prisma** 或 **Sequelize** - 用于以类型安全的方式与数据库交互，简化 SQL 查询，轻松管理 `Levels` 的 `order_index` 调整。
- **认证授权**：**JSON Web Token (JWT)** + **bcrypt** - `bcrypt` 用于密码哈希加密，JWT 用于无状态的用户会话管理。
- **定时任务**：**node-cron** - 用于执行每日扫描任务，实现 "90天未登录自动注销" 的逻辑。
- **跨域与安全**：`cors` 中间件处理跨域请求，`helmet` 增强基础安全头配置。

---

## 3. 核心模块与功能设计

### 2.1 用户模块 (User Module)

- **微信公众号验证码登录与注册 (WeChat MP Login/Register)**：
  - **背景**：为解决个人开发者无法申请微信 PC 端网页扫码登录资质的问题，采用“关注公众号并回复验证码”的曲线登录方案。
  - **流程设计**：
    1. **前端请求验证码**：用户在 PC 端点击登录，前端向后端请求生成一个唯一的短数字验证码（如 `8848`），并展示给用户，同时前端开始轮询后端的登录状态接口。
    2. **用户发送消息**：用户使用微信关注指定的公众号，并在对话框中发送该验证码 `8848`。
    3. **微信服务器回调**：微信服务器将用户的消息（包含 `OpenID` 和文本 `8848`）通过 Webhook 推送给后端服务器。
    4. **后端处理与绑定**：后端收到推送后，根据 `OpenID` 查找或静默注册用户。随后，将该用户的信息与验证码 `8848` 绑定在缓存（如 Redis）中，并标记为“已验证”，同时通过微信接口自动回复“登录成功”给用户。
    5. **前端获取 Token**：前端的轮询接口发现 `8848` 已被验证，后端即下发 JWT Token，前端完成登录跳转。
  - **状态维持**：登录/注册成功后，后端生成自定义的 JWT 令牌返回给前端，前端后续请求携带此 JWT。同时更新用户的 `last_login_time`。
- **注销用户 (Deactivate)**：
  - **规则**：当用户未登录系统 90 天以上时，系统自动将其标记为注销状态。
  - **实现方案**：在用户表中添加一个布尔类型的 `is_deactivated` 字段（默认 `false`）。后端设置一个每日定时任务（Cron Job），扫描 `last_login_time` 超过 90 天且未被注销的用户，将其 `is_deactivated` 更新为 `true`。登录接口会拦截 `is_deactivated = true` 的请求，并提示账号已注销。

### 2.2 关卡与技术模块 (Level & Technology Module)

- **获取 AI 精选关卡**：返回由 AI 处理并标记为“精选（Curated）”的公共或个性化关卡列表。
- **获取用户的技术列表**：查询当前用户所设定的所有技术模块数组。
- **添加用户的技术模块**：
  - **输入数据**：`tech_name` (如 html, css, vue), `title`, `desc`, `label`。
  - **动态处理**：
    - `path`：根据 `tech_name` 和用户 ID 动态生成唯一的路由路径。
    - `styles` (`gradient`, `shadow`, `desktopPos`)：后端通过随机算法，从符合项目 UI 规范（"The Technical Minimalist" 风格）的预设样式池中随机抽取配置，确保前端呈现既美观又多样化。
- **特定技术的关卡管理**：
  - **获取关卡**：根据指定的 `tech_id` 获取该用户当前技术下的所有关卡，并按 `order_index` 排序。
  - **添加关卡**：向特定技术中追加新关卡内容（可包含 Markdown 文本或结构化数据），系统自动分配或由前端指定一个排序索引。
  - **删除关卡**：根据关卡 ID 从特定技术中移除该关卡。
  - **调整关卡索引**：提供批量更新接口，接收关卡 ID 列表及对应的 `order_index`，实现关卡顺序（第几关）的动态重排。

---

## 3. 数据库实体关系 (ER) 设计建议

### 3.1 `Users` 表

| 字段名            | 类型      | 描述                                          |
| ----------------- | --------- | --------------------------------------------- |
| `id`              | UUID (PK) | 用户唯一标识                                  |
| `wechat_openid`   | String    | 微信用户的唯一标识 (OpenID，唯一，索引)       |
| `wechat_unionid`  | String    | 微信开放平台统一标识 (可选，多应用打通时使用) |
| `nickname`        | String    | 微信昵称 (可选，默认可为随机名)               |
| `avatar_url`      | String    | 微信头像 URL (可选)                           |
| `last_login_time` | Timestamp | 最后登录时间                                  |
| `is_deactivated`  | Boolean   | 是否已注销（软删除字段，默认 false）          |
| `created_at`      | Timestamp | 账号创建时间                                  |

### 3.2 `Technologies` 表 (用户配置的技术)

| 字段名              | 类型      | 描述                        |
| ------------------- | --------- | --------------------------- |
| `id`                | UUID (PK) | 技术配置唯一标识            |
| `user_id`           | UUID (FK) | 关联的用户 ID               |
| `tech_key`          | String    | 技术标识 (如 'html', 'vue') |
| `title`             | String    | 显示标题                    |
| `desc`              | String    | 描述文本                    |
| `label`             | String    | 标签 (如 'HOT', 'NEW')      |
| `path`              | String    | 动态生成的路由路径          |
| `style_gradient`    | String    | 随机分配的渐变样式          |
| `style_shadow`      | String    | 随机分配的阴影样式          |
| `style_desktop_pos` | String    | 随机分配的桌面位置坐标/样式 |
| `created_at`        | Timestamp | 创建时间                    |

### 3.3 `Levels` 表 (具体的关卡数据)

| 字段名          | 类型      | 描述                                        |
| --------------- | --------- | ------------------------------------------- |
| `id`            | UUID (PK) | 关卡唯一标识                                |
| `user_id`       | UUID (FK) | 关联的用户 ID                               |
| `tech_id`       | UUID (FK) | 关联的技术配置 ID                           |
| `order_index`   | Integer   | 关卡排序索引 (第几关)                       |
| `content`       | Text/JSON | 关卡具体内容 (如 Markdown 源码、题目配置等) |
| `is_ai_curated` | Boolean   | 是否为 AI 精选关卡                          |
| `created_at`    | Timestamp | 创建时间                                    |

---

## 4. 接口 (API) 设计概览

### 4.1 用户接口 (Users)

- `GET /api/users/login-code` - 前端请求获取用于登录的随机数字验证码。
- `GET /api/users/check-login?code=xxxx` - 前端轮询接口，检查特定验证码是否已完成验证并获取 JWT Token。
- `POST /api/wechat/webhook` - 微信公众号服务器的回调接口，接收用户发送的文本消息（包含 OpenID 和验证码），处理注册/登录逻辑。
- `GET /api/users/me` - 获取当前登录用户的个人信息（需验证 JWT）。
- `POST /api/users/logout` - 登出（前端清除 Token 即可，后端可选做 Token 黑名单）。

### 4.2 技术模块接口 (Technologies)

- `GET /api/techs` - 获取当前用户的所有技术数组
- `POST /api/techs` - 添加新技术（后端随机生成 styles 和 path）

### 4.3 关卡模块接口 (Levels)

- `GET /api/levels/curated` - 获取 AI 精选关卡
- `GET /api/levels/:techId` - 获取该用户特定技术的关卡（按 order_index 排序）
- `POST /api/levels/:techId` - 添加该用户特定技术的关卡
- `DELETE /api/levels/:levelId` - 删除指定关卡
- `PUT /api/levels/:techId/reorder` - 调整关卡索引（接收包含 ID 与新 order_index 的数组）
