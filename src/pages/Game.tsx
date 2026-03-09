/** @format */
import { useState } from "react";
import { parserLevel } from "../utils/parser";
import { type Level } from "../utils/type";
import { Link } from "react-router-dom";
import Level1Raw from "../levels/level1.md?raw";

export default function Game() {
  const [level] = useState<Level | null>(() => {
    const parsed = parserLevel(Level1Raw);
    return parsed;
  });

  if (!level) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-sm text-zinc-500">
          正在加载关卡内容...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur px-4">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 transition-all duration-200 ease-in-out hover:border-blue-300 hover:text-blue-700 active:scale-95"
          >
            返回首页
          </Link>
          <h1 className="text-sm md:text-base font-semibold tracking-tight">
            {level.title}
          </h1>
          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500 tabular-nums">
            <span>Level 01</span>
            <span className="inline-flex h-2 w-2 rounded-full bg-blue-500 ring-4 ring-blue-100" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
        <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-zinc-600">
              当前关卡进度
            </p>
            <p className="text-xs text-zinc-500 tabular-nums">
              25%
            </p>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-zinc-200">
            <div className="h-1.5 w-1/4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">
                  学习内容
                </h2>
                <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  理论
                </span>
              </div>
              <div className="prose prose-zinc max-w-none leading-7">
                {level.content}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">
                  挑战任务
                </h2>
                <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600">
                  待完成
                </span>
              </div>
              <div className="prose prose-zinc max-w-none text-zinc-700 leading-7">
                {level.challenge}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-100">
              <h3 className="mb-3 text-sm font-medium text-emerald-400">
                Initial Code
              </h3>
              <pre className="overflow-x-auto text-sm leading-6">
                {level.initialcode}
              </pre>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-100">
              <h3 className="mb-3 text-sm font-medium text-emerald-400">
                Validation Script
              </h3>
              <pre className="overflow-x-auto text-sm leading-6">
                {level.validationScript}
              </pre>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
