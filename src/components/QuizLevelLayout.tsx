import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { InstructionPanel } from "./InstructionPanel";
import confetti from "canvas-confetti";
import type { Level } from "../utils/type";
import { useQuizLevel } from "../hooks/useQuizLevel";

interface QuizLevelLayoutProps {
  level: Level;
  nextLevel: () => void;
}

export function QuizLevelLayout({ level, nextLevel }: QuizLevelLayoutProps) {
  const { selectedOption, setSelectedOption, error, success, checkAnswer } = useQuizLevel(level);

  useEffect(() => {
    if (success) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
      });
    }
  }, [success]);

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white z-0">
        <div className="flex-1 flex flex-col min-h-0">
          <InstructionPanel level={level} />
        </div>
      </div>
      
      <div className="w-1/2 bg-gray-50 flex flex-col overflow-hidden">
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">请选择正确的答案：</h3>
              <div className="grid gap-3">
                {level.options?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => !success && setSelectedOption(option.id)}
                    disabled={success}
                    className={`
                      flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all
                      ${success ? 'cursor-default' : 'cursor-pointer hover:border-blue-300 hover:bg-blue-50'}
                      ${
                        selectedOption === option.id
                          ? success
                            ? option.id === level.correctAnswer
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }
                      ${
                        success && option.id === level.correctAnswer && selectedOption !== option.id
                          ? 'border-green-500 bg-green-50'
                          : ''
                      }
                    `}
                  >
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm shrink-0
                      ${
                        selectedOption === option.id
                          ? success
                            ? option.id === level.correctAnswer
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                            : 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }
                      ${
                        success && option.id === level.correctAnswer && selectedOption !== option.id
                          ? 'bg-green-500 text-white'
                          : ''
                      }
                    `}>
                      {option.id}
                    </div>
                    <span className="text-gray-700">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions & Feedback */}
            <div className="pt-4 space-y-4">
              {!success && (
                <button
                  onClick={checkAnswer}
                  disabled={!selectedOption}
                  className={`
                    w-full py-3.5 rounded-xl font-medium transition-all
                    ${selectedOption 
                      ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-md active:scale-[0.98]' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                  `}
                >
                  提交答案
                </button>
              )}

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 animate-in fade-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-6 rounded-2xl bg-green-50 border border-green-100 animate-in fade-in slide-in-from-top-2 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">
                      🎉
                    </div>
                    <div>
                      <h3 className="text-green-800 font-bold text-lg">回答正确！</h3>
                      <p className="text-green-600 text-sm">你已经掌握了这个知识点。</p>
                    </div>
                  </div>
                  
                  {level.explanation && (
                    <div className="p-4 bg-white/60 rounded-xl text-green-800 text-sm leading-relaxed">
                      <strong>解析：</strong>{level.explanation}
                    </div>
                  )}

                  <button
                    onClick={nextLevel}
                    className="w-full mt-2 py-3 bg-green-500 text-white rounded-xl font-medium shadow-md shadow-green-500/20 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <span>下一关</span>
                    <ArrowLeft className="rotate-180" size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}