/** @format */
import { Link } from "react-router-dom";
import { useGameLogic } from "../hooks/useGameLogic";

export default function Game() {
  // 使用自定义 Hook
  const {
    level,
    code,
    setCode,
    runCode,
    success,
    setSuccess, // 临时用于测试
    isLoading,
  } = useGameLogic();
  if (isLoading) {
    return <div className="p-8 text-center">加载中...</div>;
  }
  if (!level) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">
          关卡未找到
        </h2>
        <Link to="/" className="text-blue-500 underline">
          返回首页
        </Link>
      </div>
    );
  }
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-900"
          >
            ← 退出
          </Link>
          <h1 className="font-bold text-lg">
            {level.title}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={runCode}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-bold"
          >
            ▶ 运行代码
          </button>
          {/* 临时测试按钮 */}
          <button
            onClick={() => setSuccess(true)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
          >
            [DEBUG] 强制通关
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：教学与编辑 */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white">
          {/* 教学区 */}
          <div className="h-1/3 p-6 overflow-y-auto border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
              任务目标
            </h2>
            <div className="prose prose-sm">
              <pre className="whitespace-pre-wrap font-sans text-gray-600">
                {level.content}
              </pre>
              <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg">
                <h3 className="font-bold mb-1">挑战：</h3>
                <pre className="whitespace-pre-wrap font-sans">
                  {level.challenge}
                </pre>
              </div>
            </div>
          </div>

          {/* 编辑区 */}
          <div className="flex-1 p-0 relative flex flex-col">
            <div className="bg-gray-100 px-4 py-2 text-xs text-gray-500 font-mono border-b">
              index.html
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full h-full p-4 font-mono text-sm resize-none outline-none bg-gray-900 text-gray-100"
              spellCheck={false}
            />
          </div>
        </div>

        {/* 右侧：预览区 */}
        <div className="w-1/2 bg-gray-50 flex flex-col relative">
          {/* 成功提示覆盖层 */}
          {success && (
            <div className="absolute inset-0 bg-green-500/90 z-20 flex flex-col items-center justify-center text-white animate-fade-in">
              <h2 className="text-4xl font-bold mb-4">
                🎉 挑战成功！
              </h2>
              <p className="mb-8 text-xl">
                你已经掌握了这个知识点。
              </p>
              <button className="px-8 py-3 bg-white text-green-600 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                下一关 →
              </button>
            </div>
          )}

          <div className="flex-1 p-8 flex items-center justify-center text-gray-400">
            预览区域 (Step 6 实现)
          </div>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div className="min-h-screen bg-white text-zinc-900 flex flex-col">
  //     <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur px-4">
  //       <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between">
  //         <Link
  //           to="/"
  //           className="inline-flex items-center rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 transition-all duration-200 ease-in-out hover:border-blue-300 hover:text-blue-700 active:scale-95"
  //         >
  //           返回首页
  //         </Link>
  //         <h1 className="text-sm md:text-base font-semibold tracking-tight">
  //           {level.title}
  //         </h1>
  //         <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500 tabular-nums">
  //           <span>
  //             Level{" "}
  //             {" 0" + (parseInt(levelIndex ?? "0") + 1)}
  //           </span>
  //           <span className="inline-flex h-2 w-2 rounded-full bg-blue-500 ring-4 ring-blue-100" />
  //         </div>
  //       </div>
  //     </header>

  //     <main className="flex-grow mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
  //       <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5">
  //         <div className="flex items-center justify-between gap-4">
  //           <p className="text-sm text-zinc-600">
  //             当前关卡进度
  //           </p>
  //           <p className="text-xs text-zinc-500 tabular-nums">
  //             25%
  //           </p>
  //         </div>
  //         <div className="mt-3 h-1.5 w-full rounded-full bg-zinc-200">
  //           <div className="h-1.5 w-1/4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
  //         </div>
  //       </div>

  //       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
  //         <section className="space-y-6">
  //           <div className="rounded-2xl border border-zinc-200 bg-white p-6">
  //             <div className="mb-4 flex items-center justify-between">
  //               <h2 className="text-lg font-semibold tracking-tight">
  //                 学习内容
  //               </h2>
  //               <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
  //                 理论
  //               </span>
  //             </div>
  //             <div className="prose prose-zinc max-w-none leading-7">
  //               {level.content}
  //             </div>
  //           </div>

  //           <div className="rounded-2xl border border-zinc-200 bg-white p-6">
  //             <div className="mb-4 flex items-center justify-between">
  //               <h2 className="text-lg font-semibold tracking-tight">
  //                 挑战任务
  //               </h2>
  //               <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600">
  //                 待完成 / {level.type}
  //               </span>
  //             </div>
  //             <div className="prose prose-zinc max-w-none text-zinc-700 leading-7">
  //               {level.challenge}
  //             </div>
  //           </div>
  //         </section>

  //         <section className="space-y-6">
  //           <div className="rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-100">
  //             <h3 className="mb-3 text-sm font-medium text-emerald-400">
  //               Initial Code
  //             </h3>
  //             <pre className="overflow-x-auto text-sm leading-6">
  //               {level.initialcode}
  //             </pre>
  //           </div>

  //           <div className="rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-100">
  //             <h3 className="mb-3 text-sm font-medium text-emerald-400">
  //               Validation Script
  //             </h3>
  //             <pre className="overflow-x-auto text-sm leading-6">
  //               {level.validationScript}
  //             </pre>
  //           </div>
  //         </section>
  //       </div>
  //     </main>
  //   </div>
  // );
}
