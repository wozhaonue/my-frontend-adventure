/** @format */

// src/components/PreviewWindow.tsx

interface Props {
  output: string; // 用户点击"运行"后生成的代码
}

export function PreviewWindow({ output }: Props) {
  // 检查代码中是否已经包含了完整的 HTML 结构
  const isFullHtml =
    /<html/i.test(output) || /<body/i.test(output);

  // 注入安全防御脚本与 CSP 策略
  const safeGuards = `
    <!-- 限制网络请求，防止引入外部恶意脚本，仅允许内联脚本和样式 -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; img-src * data: blob:;">
    <script>
      // 劫持危险的 BOM API，防止无限弹窗阻塞主线程 UI
      window.alert = function(msg) { console.warn('沙箱拦截了 alert:', msg); };
      window.confirm = function() { console.warn('沙箱拦截了 confirm'); return false; };
      window.prompt = function() { console.warn('沙箱拦截了 prompt'); return null; };
      window.open = function() { console.warn('沙箱拦截了 window.open'); return null; };
    </script>
  `;

  // 如果是完整的 HTML，在 <head> 中注入安全策略；如果是片段，则用基础模板包裹
  const srcDocContent = isFullHtml
    ? output.replace(/(<head>)/i, "$1\n" + safeGuards)
    : `
    <!DOCTYPE html>
    <html>
      <head>
        ${safeGuards}
        <style>
          body { font-family: sans-serif; padding: 1rem; margin: 0; }
        </style>
      </head>
      <body>
        ${output}
      </body>
    </html>
  `;

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
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
        title="preview"
        sandbox="allow-scripts"
        srcDoc={srcDocContent}
        className="flex-1 w-full h-full border-none bg-white"
      />
    </div>
  );
}
