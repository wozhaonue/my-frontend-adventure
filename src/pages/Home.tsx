/** @format */

import { Link } from "react-router-dom";

const LEVELS = [
  {
    id: "html",
    path: "/learn/html/0",
    label: "HTML",
    levelIdx: "01",
    title: "HTML 基础",
    desc: "搭建页面骨架，理解语义化结构。",
    progress: 25,
    locked: false,
    gradient: "from-blue-600 to-cyan-400",
    shadow: "hover:shadow-blue-500/30",
    desktopPos: "lg:left-[58%] lg:top-[18%]",
  },
  {
    id: "css",
    path: "/learn/css/0",
    label: "CSS",
    levelIdx: "02",
    title: "CSS 基础",
    desc: "掌握布局与样式系统，让页面更专业。",
    progress: 0,
    locked: true,
    gradient: "from-zinc-700 to-zinc-500",
    shadow: "hover:shadow-zinc-500/30",
    desktopPos: "lg:left-[52%] lg:top-[42%]",
  },
];

export default function Home() {
  return (
    <div className="h-screen overflow-y-auto bg-[#f2fcff] text-zinc-900">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-4 md:px-8 md:py-8 lg:h-full">
        <div className="relative flex flex-col gap-6 lg:h-full">
          {/* Main Hero Section */}
          <section className="relative overflow-hidden rounded-3xl border border-zinc-100 bg-white/85 p-7 backdrop-blur-sm md:p-10 lg:absolute lg:left-0 lg:top-16 lg:w-[62%] lg:min-h-[54%]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/90 via-white/70 to-cyan-50/80" />
            <div className="relative">
              <p className="inline-flex items-center rounded-full border border-zinc-100 bg-white px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600">
                Frontend Quest
              </p>
              <h1 className="mt-5 text-5xl font-black uppercase leading-[0.84] tracking-[-0.055em] text-zinc-950 md:text-7xl">
                <span className="block">FrontEnd</span>
                <span className="block bg-gradient-to-r from-zinc-950 via-zinc-800 to-blue-700 bg-clip-text text-transparent">
                  Adventure
                </span>
              </h1>
              <div className="mt-6 h-px w-48 bg-zinc-300" />
              <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600">
                以任务驱动方式学习 HTML 与
                CSS，通过关卡式训练快速建立前端基础能力。
              </p>
            </div>
          </section>

          {/* Mobile/Tablet List View (< lg) */}
          <div className="flex flex-col gap-6 lg:hidden">
            {LEVELS.map((level) => (
              <Link
                key={level.id}
                to={level.path}
                className="group rounded-3xl border border-zinc-100 bg-white p-5 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_16px_36px_rgba(59,130,246,0.14)] active:scale-95"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${level.gradient} text-lg font-bold text-white`}
                    >
                      {level.label}
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                        Level {level.levelIdx}
                      </p>
                      <h2 className="mt-1 truncate text-4xl font-black tracking-[-0.03em] text-zinc-950">
                        {level.title}
                      </h2>
                      <div className="mt-1 truncate text-sm leading-6 text-zinc-500">
                        {level.desc}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-10 items-center rounded-2xl bg-zinc-100 px-4 font-mono text-xs text-zinc-600">
                      {level.locked
                        ? "LOCK"
                        : `${level.progress}%`}
                    </span>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white transition-colors duration-200 group-hover:bg-blue-500">
                      ↗
                    </span>
                  </div>
                </div>
                <div className="mt-5 h-1.5 w-full rounded-full bg-zinc-200">
                  <div
                    className={`h-1.5 rounded-full ${
                      level.locked
                        ? "w-0"
                        : "bg-gradient-to-r from-blue-500 to-cyan-400"
                    }`}
                    style={{
                      width: level.locked
                        ? "0%"
                        : `${level.progress}%`,
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop Circular Nodes View (>= lg) */}
          {LEVELS.map((level) => (
            <Link
              key={level.id}
              to={level.path}
              className={`hidden lg:flex absolute group h-16 pl-2 pr-6 items-center gap-3 rounded-full bg-gradient-to-br ${level.gradient} text-white shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${level.shadow} ${level.desktopPos} z-10`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-xl font-bold backdrop-blur-sm">
                {level.label}
              </div>

              <div className="flex flex-col min-w-[80px]">
                <span className="font-mono text-[10px] uppercase leading-none opacity-80 mb-0.5">
                  Level {level.levelIdx}
                </span>
                <span className="text-sm font-bold leading-tight truncate">
                  {level.title}
                </span>
              </div>

              {/* Tooltip Bubble */}
              <div className="pointer-events-none absolute left-[100%] ml-4 top-1/2 -translate-y-1/2 w-80 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 z-20">
                <div className="relative rounded-2xl border border-zinc-100 bg-white/95 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md">
                  {/* Arrow Tip */}
                  <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-b border-l border-zinc-100 bg-white" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                        Level {level.levelIdx}
                      </p>
                      {level.locked && (
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-500">
                          LOCKED
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-zinc-900">
                      {level.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                      {level.desc}
                    </p>

                    {/* Progress Bar in Tooltip */}
                    <div className="mt-5 flex items-center gap-3">
                      <div className="h-1.5 flex-1 rounded-full bg-zinc-100">
                        <div
                          className={`h-full rounded-full ${
                            level.locked
                              ? "w-0"
                              : "bg-gradient-to-r from-blue-500 to-cyan-400"
                          }`}
                          style={{
                            width: level.locked
                              ? "0%"
                              : `${level.progress}%`,
                          }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold text-zinc-400">
                        {level.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
