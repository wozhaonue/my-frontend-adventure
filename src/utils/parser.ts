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
  const type = (metaData.type || 'code') as LevelType;
  
  const level: Level = {
    id: metaData.id || 'unknown',
    title: metaData.title || '未命名关卡',
    type,
    dificulty: Number(metaData.difficulty || metaData.dificulty || "1"), // 兼容 spelling typo
    content: getSection('learn'),
    challenge: getSection('challenge'),
  };

  if (type === 'code') {
    level.initialcode = getCodeBlock(getSection('Initial Code'));
    level.validationScript = getCodeBlock(getSection('validation'));
    level.solutionCode = getCodeBlock(getSection('solution'));
  } else if (type === 'quiz') {
    const optionsSection = getSection('options');
    const options: { id: string; text: string }[] = [];
    
    // 解析类似 "- A: 选项内容" 或 "- 选项内容" 的列表
    optionsSection.split(/\r?\n/).forEach(line => {
      const matchWithId = line.match(/^-\s*([A-Za-z0-9]+)\s*[:.]\s*(.+)/);
      if (matchWithId) {
        options.push({
          id: matchWithId[1].trim(),
          text: matchWithId[2].trim()
        });
      } else {
        const fallbackMatch = line.match(/^-\s*(.+)/);
        if (fallbackMatch) {
          // 如果没有明确的 ID，使用字母 A, B, C, D... 作为默认 ID
          const defaultId = String.fromCharCode(65 + options.length);
          options.push({
            id: defaultId,
            text: fallbackMatch[1].trim()
          });
        }
      }
    });

    level.options = options;
    level.correctAnswer = getSection('answer').trim();
    level.explanation = getSection('explanation').trim();
  }

  return level;
}
