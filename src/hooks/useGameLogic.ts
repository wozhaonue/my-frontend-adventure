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
             // 解析 Markdown
            const parsed = parserLevel(module.default);
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

    // 运行代码
    const runCode = useCallback(() => {
    setOutput(code); // 将编辑器代码同步到输出状态
    // 这里未来会加入 iframe 验证逻辑
    console.log("Running code:", code);
  }, [code]);
  return {
    currentTech,
    currentLevelIndex,
    level,
    code,
    setCode, // 暴露给编辑器组件使用
    output,
    error,
    success,
    setSuccess, // 临时暴露，方便测试
    isLoading,
    runCode,
    nextLevel
  };
  }