// 支持地技术栈
export type TechType = 'html' | 'css' | 'javascript' | 'vue' | 'typescript' | 'react';

// 支持的关卡类型
export type LevelType = 'code' | 'quiz';

// 选择题选项
export interface QuizOption {
  id: string;
  text: string;
}

// 关卡接口
export interface Level {
    id: string;
    title: string;
    type: LevelType;
    dificulty: number; // 1-5
    content: string; // 教学内容
    challenge: string; // 挑战描述
    
    // 编码题专属字段
    initialcode?: string; // 初始化代码
    validationScript?: string; // 代码题验证脚本
    solutionCode?: string; // 参考答案
    
    // 选择题专属字段
    options?: QuizOption[]; // 选项列表
    correctAnswer?: string; // 正确答案的 ID
    explanation?: string; // 答案解析
}