import { useCallback, useState } from "react";
import type { Level } from "../utils/type";

export function useQuizLevel(level: Level | null) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const checkAnswer = useCallback(() => {
    if (!selectedOption) {
      setError("请先选择一个答案");
      return;
    }

    if (level?.correctAnswer && selectedOption === level.correctAnswer) {
      setSuccess(true);
      setError(null);
    } else {
      setSuccess(false);
      setError("答案不正确，请再试一次");
    }
  }, [selectedOption, level]);

  return { selectedOption, setSelectedOption, error, success, checkAnswer };
}
