import type { Level, LevelType } from "./type";
// 当前存在缺陷：对于内容的多行读取会丢失换行符

// 解析markdown格式文档为关卡数据
export function parserLevel(markdown: string):Level{
  // 1.提取元数据
  // 兼容 Windows (CRLF) 和 Unix (LF) 换行符
  const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = markdown.match(frontMatterRegex);
  const metaData: Record<string, string> = {};
  let contentBody = markdown;
  if(match){
    const frontMatter = match[1];
    contentBody = markdown.slice(match[0].length);
    // 使用正则分割行，兼容不同换行符
    frontMatter.split(/\r?\n/).forEach((line) => {
      const [key,...value] = line.split(':');
      if(key && value){
        metaData[key.trim()] = value.join(':').trim();
      }
    })
  }

  // 辅助函数，提取特定Section内容
  // 匹配 ## header ... 直到下一个##出现或者文本结束
  const getSection = (header: string): string => {
    // 兼容 CRLF 和 LF
    const regex = new RegExp(`## ${header}\\s*\\r?\\n([\\s\\S]*?)(?=\\r?\\n## |$)`,'i');
    const sectionMatch = contentBody.match(regex);
    // 这里应该是 sectionMatch[1] 来获取捕获组的内容，而不是 sectionMatch[0]（会包含 ## header）
    return sectionMatch ? sectionMatch[1].trim() : '';
  }

  // 辅助函数，提取代码块内容
  const getCodeBlock = (section: string): string => {
      // 兼容 CRLF 和 LF
      const codeBlockRegex = /```(?:html|css|js|javascript|ts|typescript)?\r?\n([\s\S]*?)```/;
    const codeMatch = section.match(codeBlockRegex);
    return codeMatch ? codeMatch[1].trim() : section;
  }
  
  // 组装Level对象
  return {
    id: metaData.id || 'unknown',
    title: metaData.title || '未命名关卡',
    type: (metaData.type || 'code') as LevelType,
    dificulty: Number(metaData.difficulty || metaData.dificulty || "1"), // 兼容 spelling typo
    content: getSection('learn'),
    challenge: getSection('challenge'),
    initialcode: getCodeBlock(getSection('Initial Code')),
    validationScript: getCodeBlock(getSection('validation')),
    solutionCode: getCodeBlock(getSection('solution')),
  };
}
