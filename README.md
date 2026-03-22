<!-- @format -->

# Frontend Adventure (前端技术自学闯关项目)

## 🌟 项目背景和价值

传统的纯文本前端学习路线往往枯燥乏味，缺乏即时反馈。本项目旨在打造一个**任务驱动、游戏化**的前端交互式学习平台。通过精心设计的关卡（涵盖 HTML、CSS、JavaScript 及现代前端框架），让初学者能够在浏览器中边学边练，通过编写代码并通过沙箱验证来解锁下一关，极大地降低了学习门槛并提升了学习的趣味性与成就感。

## 🛠️ 技术栈

- **核心框架**: React 19 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS (支持现代化 Glassmorphism 风格与丝滑动画)
- **路由管理**: React Router DOM v7
- **内容解析**: `react-markdown` + `remark-gfm` (用于渲染 Markdown 关卡教程)
- **UI 图标**: `lucide-react`

## ✨ 核心功能和亮点

- **🎮 沉浸式闯关学习地图**：提供从 HTML 基础到 React/Vue 生态的完整技能树，包含炫酷的节点连接视觉与关卡解锁机制。
- **📝 Markdown 驱动的关卡引擎**：题目内容、初始代码、过关校验脚本均由纯 Markdown 文件（如 `src/levels/level1.md`）定义，平台自动解析元数据（`src/utils/parser.ts`），极大地简化了新增关卡的维护成本。
- **💻 可伸缩的交互式编码区**：内置代码编辑器，支持与题目区域的上下拖拽自适应伸缩以及一键最小化折叠（`src/pages/Game.tsx`），并加入了 requestAnimationFrame 优化的拖拽虚影性能处理。
- **🔍 安全沙箱与实时预览**：采用独立 `iframe` 构建安全沙箱环境（`src/components/PreviewWindow.tsx`），用户输入代码后点击运行可实时预览 HTML/JS 渲染效果。
- **✅ 动态代码沙箱验证**：内置自动化代码验证机制，通过执行关卡中预设的 JavaScript 校验脚本（`src/hooks/useGameLogic.ts`），在隐藏 iframe 中对用户的代码逻辑进行精准断言与通关判定。
- **🎨 现代化的 UI/UX 设计**：精心挑选的全站排版系统字体栈、无感隐藏式滚动条、毛玻璃高斯模糊背景等细节设计，提供舒适的视觉与交互体验。

## 如何在本地运行

npm install

node版本需要控制在20.19.0，tailwindcss需要下载指定版本3.4.17

- npm install -D tailwindcss postcss autoprefixer
- npx tailwindcss init -p
- npm install react-router-dom
- npm run dev

运行完以上命令即可在本地运行
