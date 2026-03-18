/** @format */

import { Play } from "lucide-react";

interface Props {
  code: string;
  setCode: (code: string) => void;
  tech: string;
  onRun: () => void;
}

export function CodeEditor({
  code,
  setCode,
  tech,
  onRun,
}: Props) {
  return (
    <div className="relative flex-1 flex flex-col min-h-[300px] bg-[#1e1e1e] text-white">
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] text-xs text-gray-400 border-b border-[#3e3e42]">
        <span className="font-mono">
          script.{tech === "html" ? "html" : "js"}
        </span>
        <span>UTF-8</span>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-1 w-full h-full p-4 font-mono text-sm resize-none outline-none bg-transparent text-gray-100 leading-relaxed"
        spellCheck={false}
        placeholder="// 在此输入代码..."
      />

      {/* 悬浮运行按钮 */}
      <button
        onClick={onRun}
        className="absolute bottom-6 right-6 p-4 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-green-500/20 hover:scale-105 active:scale-95 transition-all z-10"
        title="运行代码 (Ctrl+Enter)"
      >
        <Play size={24} fill="currentColor" />
      </button>
    </div>
  );
}
