import { useNavigate, useParams } from "react-router-dom";
import type { Level, TechType } from "../utils/type";
import { useCallback, useEffect, useState } from "react";
import { levelLoaders } from "../levels";
import { parserLevel } from "../utils/parser";

  export function useGameLogic(){
    const navigate = useNavigate();
    // 获取params参数
    const {tech,levelIndex} = useParams<
    {
      tech: string;
      levelIndex:string;
    }
    >();
    
    const currentTech = tech as TechType || 'html';
    const currentLevelIndex = parseInt(levelIndex || '0',10);
    
    // 定义各种状态
    const [level, setLevel] = useState<Level | null>(null);
     const [code, setCode] = useState(""); // 用户当前写的代码
     const [output, setOutput] = useState(""); // 运行时的代码（点击运行后更新）
     const [error, setError] = useState<string | null>(null); // 错误信息
     const [success, setSuccess] = useState(false); // 是否通过
     const [isLoading, setIsLoading] = useState(false);

    //  组件第一次挂载时进行获取数据
    useEffect(() => {
      const loadLevel = async() => {
        setIsLoading(true);
        const loaders = levelLoaders[currentTech];
        
        if(loaders && loaders[currentLevelIndex]){
          try{
            // 动态导入文件
            const module = await loaders[currentLevelIndex]();
            // console.log("dynamically imported module:", module);
            // 兼容不同的打包工具或Vite版本，有时 default 是字符串，有时 module 本身就是字符串
            const markdownContent = typeof module === 'string' ? module : module.default;
            if (!markdownContent) {
              throw new Error("Failed to get markdown content from imported module");
            }

             // 解析 Markdown
            const parsed = parserLevel(markdownContent);
            // console.log("parsed markdown:", parsed);
             // 更新状态
            setLevel(parsed);
            setCode(parsed.initialcode || ""); // 重置代码为初始代码
            // 重置其他状态
            setSuccess(false);
            setError(null);
            setOutput("");
          } catch(err){
            console.error("Failed to load level:", err);
            setLevel(null);  // 无法获得level数据需要至少赋值个null，避免报错
          }
        }else{
          setLevel(null); 
        }
        setIsLoading(false);
      }
      loadLevel();
    }, [currentTech, currentLevelIndex])// 依赖项：当 tech 或 levelIndex 变化时重新加载
    // 点击下一关逻辑 （通过按钮点击执行）
    const nextLevel = useCallback(()=>{
      const totalLevels = levelLoaders[currentTech]?.length || 0;
    if (currentLevelIndex < totalLevels - 1) {
      navigate(`/learn/${currentTech}/${currentLevelIndex + 1}`);
    } else {
      alert("恭喜！你已完成该技术栈的所有关卡！");
    }
    },[currentTech, currentLevelIndex, navigate])


  // 6. 运行代码与验证
  const runCode = useCallback(() => {
    setOutput(code); // 更新视图
    setError(null);  // 清除旧错误
    setSuccess(false);

    if (level?.validationScript) {
      try {
        // 创建一个临时的、隐藏的 iframe 用于执行验证
        // 我们不直接用 PreviewWindow 的 iframe，是为了防止验证脚本影响视图，或者被视图中的 JS 干扰
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(code);
          doc.close();

          // 使用 new Function 构建验证函数
          // 参数1: document (指向 iframe 的 document)
          // 参数2: window (指向 iframe 的 window)
          // 函数体: 关卡中的 validationScript
          const validationFn = new Function(
            "document",
            "window",
            level.validationScript
          );

          // 执行验证
          const result = validationFn(doc, iframe.contentWindow);

          if (result === true) {
            setSuccess(true);
            // 未来这里可以调用 markLevelComplete 保存进度
          } else {
            // 如果返回的是字符串，说明是具体的错误提示
            setError(typeof result === "string" ? result : "验证失败，请检查代码。");
          }
        }
        // 验证完毕，清理临时 iframe
        document.body.removeChild(iframe);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "未知异常";
        setError("验证脚本执行错误: " + message);
      }
    } else {
      // 如果没有验证脚本，直接认为通关（或者只是纯预览）
      setSuccess(true);
    }
  }, [code, level]);


  return {
    currentTech,
    currentLevelIndex,
    level,
    code,
    setCode, // 暴露给编辑器组件使用
    output,
    error,
    success,
    // setSuccess, // 临时暴露，方便测试
    isLoading,
    runCode,
    nextLevel
  };
  }
