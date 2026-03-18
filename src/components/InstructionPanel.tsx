/** @format */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Level } from "../utils/type";

interface Props {
  level: Level;
}
// 优化markdown解析所使用的正则表达式
function normalizeMarkdown(markdown: string) {
  return markdown.replace(
    /(^|[^`])(<\/?[a-z][^>\n]*>)(?=[\s).,，。]|$)/gi,
    (_, prefix: string, tag: string) =>
      `${prefix}\`${tag}\``,
  );
}

export function InstructionPanel({ level }: Props) {
  const content = normalizeMarkdown(level.content);
  const challenge = normalizeMarkdown(level.challenge);

  return (
    <div className="hide-scrollbar relative flex-1 overflow-y-auto bg-white border-b border-gray-200">
      {/* 关卡头部信息 */}
      <div className="p-6 pb-2 border-b border-gray-100 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {level.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span
              className={`w-2 h-2 rounded-full ${
                level.dificulty === 1
                  ? "bg-green-500"
                  : "bg-orange-500"
              }`}
            />
            <span>难度: {level.dificulty}/5</span>
          </div>
        </div>
      </div>

      <div className="p-6 pt-4 prose prose-sm max-w-none prose-blue">
        {/* 渲染教学内容 */}
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
            🎯 挑战任务
          </h3>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {challenge}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
