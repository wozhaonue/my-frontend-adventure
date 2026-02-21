/** @format */
import { useParams, Link } from "react-router-dom";

export default function Game() {
  const { tech, levelIndex } = useParams();
  const validTypes = {
    html: "orange",
    css: "blue",
  };
  let tagClass: string;
  if (tech && tech in validTypes) {
    tagClass = `bg-${validTypes[tech as keyof typeof validTypes]}-100 text-${validTypes[tech as keyof typeof validTypes]}-800`;
  } else {
    tagClass = "bg-green-100 text-green-800";
  }
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold text-gray-700 hover:text-gray-900"
        >
          ◀返回首页
        </Link>
        <div className="flex gap-2">
          <span className=" px-3 py-1 bg-gray-200 rounded-full text-sm font-medium uppercase"></span>
          <span
            className={`px-3 py-1 rounded-full ${tagClass}`}
          >
            Level {parseInt(levelIndex || "0") + 1}
          </span>
        </div>
      </header>
      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            正在游玩:{tech} - 第{" "}
            {parseInt(levelIndex || "0") + 1} 关
          </h2>
          <p className="text-gray-500">加载游戏组件...</p>
        </div>
      </main>
    </div>
  );
}
