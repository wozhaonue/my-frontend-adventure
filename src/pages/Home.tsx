/** @format */

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 px-4 py-10 md:py-16">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <section className="rounded-2xl border border-zinc-200 bg-white p-8 md:p-10">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            Frontend Quest
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight">
            FrontEnd Adventure
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            以任务驱动方式学习 HTML 与
            CSS，通过关卡式训练快速建立前端基础能力。
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
              <div className="text-xs text-zinc-500">
                学习路径
              </div>
              <div className="mt-1 text-lg font-semibold tabular-nums">
                02 章节
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
              <div className="text-xs text-zinc-500">
                当前阶段
              </div>
              <div className="mt-1 text-lg font-semibold">
                基础入门
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
              <div className="text-xs text-zinc-500">
                完成度
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-200">
                <div className="h-1.5 w-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/learn/html/0"
            className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm active:scale-95"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-zinc-500">
                  Level 01
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  HTML 基础
                </h2>
                <div className="mt-2 text-zinc-600 leading-7">
                  搭建页面骨架，理解语义化结构。
                </div>
              </div>
              <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-blue-100" />
            </div>
            <div className="mt-6 h-1.5 w-full rounded-full bg-zinc-200">
              <div className="h-1.5 w-1/4 rounded-full bg-blue-500" />
            </div>
          </Link>
          <Link
            to="/learn/css/0"
            className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm active:scale-95"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-zinc-500">
                  Level 02
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  CSS 基础
                </h2>
                <div className="mt-2 text-zinc-600 leading-7">
                  掌握布局与样式系统，让页面更专业。
                </div>
              </div>
              <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-zinc-300 ring-4 ring-zinc-100" />
            </div>
            <div className="mt-6 h-1.5 w-full rounded-full bg-zinc-200">
              <div className="h-1.5 w-0 rounded-full bg-blue-500" />
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
