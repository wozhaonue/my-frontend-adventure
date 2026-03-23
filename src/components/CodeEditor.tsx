/** @format */

import { useState } from "react";
import { Play } from "lucide-react";
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';

interface Props {
  code: string;
  setCode: (code: string) => void;
  tech: string;
  onRun: () => void;
}

const themes = {
  vscodeDark: { name: 'VS Code Dark', value: vscodeDark },
  dracula: { name: 'Dracula', value: dracula },
  githubDark: { name: 'GitHub Dark', value: githubDark },
  githubLight: { name: 'GitHub Light', value: githubLight },
};

export function CodeEditor({
  code,
  setCode,
  tech,
  onRun,
}: Props) {
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>('vscodeDark');

  // 动态选择语言扩展
  const getLanguageExtension = () => {
    switch (tech) {
      case 'html': return [html()];
      case 'css': return [css()];
      case 'js':
      case 'javascript': return [javascript({ jsx: true })];
      default: return [html()];
    }
  };

  return (
    <div className="relative flex-1 flex flex-col min-h-[300px] bg-[#1e1e1e] text-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] text-xs text-gray-400 border-b border-[#3e3e42] z-10">
        <span className="font-mono">
          script.{tech === "html" ? "html" : tech === "css" ? "css" : "js"}
        </span>
        <div className="flex items-center gap-4">
          <select
            value={currentTheme}
            onChange={(e) => setCurrentTheme(e.target.value as keyof typeof themes)}
            className="bg-[#1e1e1e] border border-[#3e3e42] text-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 transition-colors"
            title="选择编辑器主题"
          >
            {Object.entries(themes).map(([key, theme]) => (
              <option key={key} value={key}>
                {theme.name}
              </option>
            ))}
          </select>
          <span>UTF-8</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-transparent relative">
        <CodeMirror
          value={code}
          height="100%"
          theme={themes[currentTheme].value}
          extensions={getLanguageExtension()}
          onChange={(value) => setCode(value)}
          className="h-full text-sm font-mono absolute inset-0"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            defaultKeymap: true,
            searchKeymap: true,
            historyKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
        />
      </div>

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
