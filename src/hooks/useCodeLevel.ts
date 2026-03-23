import { useCallback, useState } from "react";
import type { Level } from "../utils/type";

export function useCodeLevel(level: Level | null) {
  const [code, setCode] = useState(() => level?.type === 'code' ? level.initialcode || "" : "");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const runCode = useCallback(() => {
    setOutput(code);
    setError(null);
    setSuccess(false);

    if (level?.validationScript) {
      try {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(code);
          doc.close();

          const validationFn = new Function(
            "document",
            "window",
            level.validationScript
          );

          const result = validationFn(doc, iframe.contentWindow);

          if (result === true) {
            setSuccess(true);
          } else {
            setError(typeof result === "string" ? result : "验证失败，请检查代码。");
          }
        }
        document.body.removeChild(iframe);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "未知异常";
        setError("验证脚本执行错误: " + message);
      }
    } else {
      setSuccess(true);
    }
  }, [code, level]);

  return { code, setCode, output, error, success, runCode };
}
