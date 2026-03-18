import type { TechType } from "../utils/type";

// 使用Record映射关系映射技术对应的md文件
export const levelLoaders:Record<TechType,(() => Promise<typeof import('*?raw')>)[]> = {
  html: [
    // 假设我们有多个关卡，这里先只放一个 level1
    // 注意：在 Vite 中，?raw 让我们可以获取文件内容字符串
    () => import('./level1.md?raw'),
  ],
  css: [],
  javascript: [],
  vue: [],
  typescript: [],
  react: [],
}

// 获取对应技术的关卡数量
export const getTechCounts = (tech:TechType) => {
  return levelLoaders[tech]?.length || 0;
}