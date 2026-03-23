/** @format */
import { Link } from "react-router-dom";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { useGameLogic } from "../hooks/useGameLogic";
import { CodeLevelLayout } from "../components/CodeLevelLayout";
import { QuizLevelLayout } from "../components/QuizLevelLayout";

export default function Game() {
  const { nextLevel, currentTech, level, isLoading } =
    useGameLogic();

  if (isLoading) {
    return (
      <div className="p-8 text-center pt-24">加载中...</div>
    );
  }

  if (!level) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f2fcff] pt-16">
        <div className="flex flex-col items-center gap-6 p-8 text-center animate-in fade-in zoom-in duration-500">
          {/* Icon Circle */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-200/40 rounded-full blur-2xl opacity-50" />
            <div className="relative bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-50/50">
              <FileQuestion
                size={64}
                className="text-blue-500/80"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-3 max-w-md">
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
              未找到关卡
            </h2>
            <p className="text-zinc-500 leading-relaxed">
              看起来这个关卡还在施工中，或者您迷失了方向。
              <br />
              请检查网址或返回首页探索其他内容。
            </p>
          </div>

          {/* Button */}
          <Link
            to="/"
            className="group mt-2 flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium transition-all duration-300 hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-900/20 active:scale-95"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>返回首页</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] mt-16 flex flex-col bg-gray-50 overflow-hidden">
      {level.type === "code" ? (
        <CodeLevelLayout
          key={level.id}
          level={level}
          currentTech={currentTech}
          nextLevel={nextLevel}
        />
      ) : level.type === "quiz" ? (
        <QuizLevelLayout
          key={level.id}
          level={level}
          nextLevel={nextLevel}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          不支持的关卡类型
        </div>
      )}
    </div>
  );
}
