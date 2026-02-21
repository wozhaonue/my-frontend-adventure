/** @format */
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 根路径显示首页 */}
        <Route path="/" element={<Home />}></Route>
        {/* 动态路由： tech表示技术栈，levelIndex表示当前闯关关卡的索引 */}
        <Route
          path="/learn/:tech/:levelIndex"
          element={<Game />}
        ></Route>
        {/* 重定向其他页面 */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
