/** @format */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Trophy, Edit2 } from "lucide-react";
import logo from "../assets/faviarite.jpg";

export default function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [nickname, setNickname] = useState(() => {
    return (
      localStorage.getItem("player_nickname") || "冒险者"
    );
  });
  const [avatar, setAvatar] = useState(() => {
    return (
      localStorage.getItem("player_avatar") ||
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    );
  });
  const [isEditingName, setIsEditingName] = useState(false);

  const handleNameSave = (newName: string) => {
    if (!newName.trim()) {
      setIsEditingName(false);
      return;
    }
    setNickname(newName);
    localStorage.setItem("player_nickname", newName);
    setIsEditingName(false);
  };

  const handleAvatarChange = () => {
    const newUrl = window.prompt(
      "请输入新的头像图片地址:",
      avatar,
    );
    if (newUrl && newUrl.trim()) {
      setAvatar(newUrl);
      localStorage.setItem("player_avatar", newUrl);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHomePage
          ? "bg-transparent backdrop-blur-none border-transparent"
          : "bg-white/80 backdrop-blur-md border-b border-zinc-200/50 shadow-sm"
      }`}
    >
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Left: Home Link */}
        <Link
          to="/"
          className={`group flex items-center gap-3 px-2 py-1.5 rounded-xl transition-all duration-200 ${
            isHomePage
              ? "hover:bg-white/20"
              : "hover:bg-zinc-100/50"
          }`}
        >
          <div className="relative overflow-hidden rounded-full border border-zinc-200 shadow-sm w-9 h-9 group-hover:scale-105 transition-transform duration-300">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-zinc-900 tracking-tight text-lg group-hover:text-blue-600 transition-colors">
            Frontend Adventure
          </span>
        </Link>

        {/* Right: Profile */}
        <div className="flex items-center gap-4">
          {/* Honor Title */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-100/50 text-amber-700 text-xs font-bold shadow-sm">
            <Trophy size={13} className="text-amber-500" />
            <span>初级冒险者</span>
          </div>

          <div className="h-6 w-px bg-zinc-200 hidden md:block" />

          {/* User Profile Area */}
          <div className="flex items-center gap-3">
            {/* Nickname */}
            <div className="relative group/name">
              {isEditingName ? (
                <input
                  type="text"
                  autoFocus
                  className="w-24 bg-transparent border-b-2 border-blue-500 outline-none text-sm text-zinc-800 font-medium px-1 py-0.5"
                  defaultValue={nickname}
                  onBlur={(e) =>
                    handleNameSave(e.target.value)
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handleNameSave(e.currentTarget.value)
                  }
                />
              ) : (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-zinc-100 text-sm font-medium text-zinc-700 transition-colors group-hover/name:text-blue-600"
                  title="点击修改昵称"
                >
                  <span>{nickname}</span>
                  <Edit2
                    size={12}
                    className="opacity-0 group-hover/name:opacity-50"
                  />
                </button>
              )}
            </div>

            {/* Avatar */}
            <button
              onClick={handleAvatarChange}
              className="relative w-9 h-9 rounded-full overflow-hidden border border-zinc-200 shadow-sm hover:shadow-md transition-all hover:ring-2 hover:ring-blue-100 hover:ring-offset-1"
              title="点击修改头像"
            >
              <img
                src={avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
