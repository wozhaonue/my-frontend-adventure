import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  ArrowLeft,
  ChevronsDown,
  ChevronsUp,
  GripHorizontal,
} from "lucide-react";
import { InstructionPanel } from "./InstructionPanel";
import { CodeEditor } from "./CodeEditor";
import { PreviewWindow } from "./PreviewWindow";
import confetti from "canvas-confetti";
import type { Level, TechType } from "../utils/type";
import { useCodeLevel } from "../hooks/useCodeLevel";

// 存储伸缩的边界值
const MIN_TOP_PERCENT = 24;
const MAX_TOP_PERCENT = 76;
const SPLITTER_HEIGHT_PX = 40;

interface CodeLevelLayoutProps {
  level: Level;
  currentTech: TechType;
  nextLevel: () => void;
}

export function CodeLevelLayout({ level, currentTech, nextLevel }: CodeLevelLayoutProps) {
  const { code, setCode, output, error, success, runCode } = useCodeLevel(level);
  
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const [topPanelPercent, setTopPanelPercent] = useState(40);
  const [lastTopPanelPercent, setLastTopPanelPercent] = useState(40);
  const [isEditorMinimized, setIsEditorMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPreviewPercent, setDragPreviewPercent] = useState<number | null>(null);
  const dragFrameRef = useRef<number | null>(null);
  const dragClientYRef = useRef<number | null>(null);

  const clampPanelPercent = useCallback(
    (percent: number) =>
      Math.min(MAX_TOP_PERCENT, Math.max(MIN_TOP_PERCENT, percent)),
    [],
  );

  const getPercentByPointer = useCallback(
    (clientY: number) => {
      const panel = leftPanelRef.current;
      if (!panel) return topPanelPercent;
      const rect = panel.getBoundingClientRect();
      const availableHeight = rect.height - SPLITTER_HEIGHT_PX;
      const rawPercent =
        ((clientY - rect.top - SPLITTER_HEIGHT_PX / 2) / availableHeight) * 100;
      return clampPanelPercent(rawPercent);
    },
    [clampPanelPercent, topPanelPercent],
  );

  const flushDragPreview = useCallback(() => {
    dragFrameRef.current = null;
    if (dragClientYRef.current === null) return;
    const nextPercent = getPercentByPointer(dragClientYRef.current);
    setDragPreviewPercent(nextPercent);
  }, [getPercentByPointer]);

  const scheduleDragPreview = useCallback(
    (clientY: number) => {
      dragClientYRef.current = clientY;
      if (dragFrameRef.current !== null) return;
      dragFrameRef.current = window.requestAnimationFrame(flushDragPreview);
    },
    [flushDragPreview],
  );

  const handleDragStart = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isEditorMinimized) {
      setIsEditorMinimized(false);
      setTopPanelPercent(lastTopPanelPercent);
    }
    const startPercent = getPercentByPointer(event.clientY);
    setIsDragging(true);
    setDragPreviewPercent(startPercent);
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

    const handleMouseMove = (moveEvent: MouseEvent) => {
      scheduleDragPreview(moveEvent.clientY);
    };
    const handleMouseUp = (upEvent: MouseEvent) => {
      const nextPercent = getPercentByPointer(upEvent.clientY);
      setTopPanelPercent(nextPercent);
      setLastTopPanelPercent(nextPercent);
      setIsDragging(false);
      setDragPreviewPercent(null);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      if (dragFrameRef.current !== null) {
        window.cancelAnimationFrame(dragFrameRef.current);
        dragFrameRef.current = null;
      }
      dragClientYRef.current = null;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    return () => {
      if (dragFrameRef.current !== null) {
        window.cancelAnimationFrame(dragFrameRef.current);
      }
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, []);

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

  const handleToggleEditor = () => {
    if (isEditorMinimized) {
      setIsEditorMinimized(false);
      setTopPanelPercent(lastTopPanelPercent);
      return;
    }
    setLastTopPanelPercent(topPanelPercent);
    setIsEditorMinimized(true);
  };

  const topPanelHeight = isEditorMinimized
    ? `calc(100% - ${SPLITTER_HEIGHT_PX}px)`
    : `calc((100% - ${SPLITTER_HEIGHT_PX}px) * ${topPanelPercent / 100})`;
  const editorPanelHeight = isEditorMinimized
    ? "0%"
    : `calc((100% - ${SPLITTER_HEIGHT_PX}px) * ${1 - topPanelPercent / 100})`;
  const previewLineTop =
    dragPreviewPercent === null
      ? null
      : `calc((100% - ${SPLITTER_HEIGHT_PX}px) * ${
          dragPreviewPercent / 100
        } + ${SPLITTER_HEIGHT_PX / 2}px)`;

  return (
    <div className="flex-1 flex overflow-hidden">
      <div
        ref={leftPanelRef}
        className="relative w-1/2 flex flex-col border-r border-gray-200 bg-white z-0"
      >
        {isDragging && previewLineTop && (
          <div
            className="pointer-events-none absolute left-0 right-0 z-20"
            style={{ top: previewLineTop }}
          >
            <div className="mx-2 h-1 rounded-full bg-blue-500/70 shadow-[0_0_0_4px_rgba(59,130,246,0.15)]" />
          </div>
        )}
        <div
          className="min-h-0 flex flex-col border-b border-gray-200"
          style={{ height: topPanelHeight }}
        >
          <InstructionPanel level={level} />
        </div>
        <div
          role="separator"
          aria-orientation="horizontal"
          aria-label="调整题目区与编码区高度"
          onMouseDown={handleDragStart}
          className="h-10 shrink-0 border-y border-gray-200 bg-gray-50 px-3 flex items-center justify-between cursor-row-resize select-none"
        >
          <GripHorizontal size={16} className="text-gray-400" />
          <button
            onMouseDown={(event) => event.stopPropagation()}
            onClick={handleToggleEditor}
            className="h-8 w-8 rounded-lg border border-gray-300 bg-white text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors flex items-center justify-center"
            title={isEditorMinimized ? "恢复编码区" : "最小化编码区"}
          >
            {isEditorMinimized ? (
              <ChevronsUp size={16} />
            ) : (
              <ChevronsDown size={16} />
            )}
          </button>
        </div>
        <div
          className="min-h-0 flex flex-col overflow-hidden"
          style={{ height: editorPanelHeight }}
        >
          {!isEditorMinimized && (
            <CodeEditor
              code={code}
              setCode={setCode}
              tech={currentTech}
              onRun={runCode}
            />
          )}
        </div>
      </div>
      <div className="w-1/2 bg-gray-100 flex flex-col overflow-hidden">
        {/* Top 2/3: Preview Window */}
        <div className="flex-[2] overflow-hidden min-h-0 border-b border-gray-200 shadow-sm z-10">
          <PreviewWindow output={output} />
        </div>

        {/* Bottom 1/3: Status Area */}
        <div className="flex-1 overflow-hidden bg-white flex flex-col p-6">
          {success ? (
            <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                挑战成功！
              </h2>
              <p className="text-gray-500 mb-6 text-sm">
                你已经掌握了本关卡的知识点。
              </p>
              <button
                onClick={nextLevel}
                className="px-6 py-2.5 bg-green-500 text-white rounded-xl font-medium shadow-md shadow-green-500/20 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30 transition-all active:scale-95 flex items-center gap-2"
              >
                <span>下一关</span>
                <ArrowLeft className="rotate-180" size={16} />
              </button>
            </div>
          ) : error ? (
            <div className="flex-1 bg-red-50 rounded-xl border border-red-100 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-auto">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                  <span className="text-red-500 text-lg leading-none">❌</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-red-800 font-semibold mb-1">运行错误</h3>
                  <pre className="text-sm text-red-600 font-mono whitespace-pre-wrap break-words">
                    {error}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="w-16 h-16 mb-4 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                <span className="text-2xl">⚡</span>
              </div>
              <p className="text-sm font-medium">点击运行查看结果</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
