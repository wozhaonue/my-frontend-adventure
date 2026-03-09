// 支持地技术栈
export type TechType = 'html' | 'css' | 'javascript';

// 支持的关卡类型
export type LevelType = 'code' | 'quiz';

// 关卡接口
export interface Level {
    id: string;
    title: string;
    type: LevelType;
    dificulty: number; // 1-5
    content: string; // 教学内容
    challenge: string; // 挑战描述
    initialcode?: string; // 初始化代码
    validationScript?: string; // 代码题验证脚本
    solutionCode?: string; // 参考答案
}