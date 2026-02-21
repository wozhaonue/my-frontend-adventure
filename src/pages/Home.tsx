/** @format */

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        FrontEnd Adventure
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/learn/html/0"
          className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-orange-500"
        >
          <h2 className="text-2xl font-bold mb-2">
            HTML基础
          </h2>
          <div className="text-gray-600">搭建基础骨架</div>
        </Link>
        <Link
          to="/learn/css/0"
          className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500"
        >
          <h2 className="text-2xl font-bold mb-2">
            CSS基础
          </h2>
          <div className="text-gray-600">
            美化你的网页样式
          </div>
        </Link>
      </div>
    </div>
  );
}
