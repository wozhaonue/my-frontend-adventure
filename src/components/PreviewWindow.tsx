/** @format */

// src/components/PreviewWindow.tsx
import { useEffect, useRef } from "react";

interface Props {
  output: string; // 用户点击"运行"后生成的代码
  error: string | null; // 验证错误信息
}

export function PreviewWindow({ output, error }: Props) {
  // 获取 iframe DOM 的引用
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 当 output 变化时，更新 iframe 的内容
  useEffect(() => {
    if (!iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    if (doc) {
      doc.open();
      // 写入一些基础样式，让预览更好看
      doc.write(`
        <style>
          body { font-family: sans-serif; padding: 1rem; margin: 0; }
        </style>
        ${output}
      `);
      doc.close();
    }
  }, [output]);

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      {/* 错误信息栏 */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 text-red-600 p-3 text-sm flex items-start gap-2 absolute top-0 w-full z-10">
          <span>❌</span>
          <span className="font-mono">{error}</span>
        </div>
      )}

      {/* 浏览器顶栏装饰 */}
      <div className="h-8 bg-gray-200 flex items-center px-4 gap-2 border-b border-gray-300">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="bg-white px-3 py-0.5 rounded text-xs text-gray-500 flex-1 ml-4 shadow-sm text-center">
          localhost:3000
        </div>
      </div>

      {/* 沙箱 iframe */}
      <iframe
        ref={iframeRef}
        title="preview"
        sandbox="allow-scripts"
        className="flex-1 w-full h-full border-none"
      />
    </div>
  );
}
