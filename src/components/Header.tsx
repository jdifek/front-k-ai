// src/components/Header.tsx

import React from "react";
import { ChevronDown, PanelLeftOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  selectedVersion: string;
  setIsVersionDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isVersionDropdownOpen: boolean;
  versions: string[];
  handleVersionSelect: (version: string) => void;
  activeBarProfile: boolean;
  setActiveBarProfile: React.Dispatch<React.SetStateAction<boolean>>;
  token: string | null;
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isDarkMode,
  setIsDarkMode,
  selectedVersion,
  setIsVersionDropdownOpen,
  isVersionDropdownOpen,
  versions,
  handleVersionSelect,
  activeBarProfile,
  setActiveBarProfile,
  token,
  setIsLoginModalOpen,
}) => {
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-gray-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-2 relative">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-2 rounded-lg ${
            isDarkMode
              ? "text-white hover:bg-gray-800"
              : "text-black hover:bg-gray-200"
          }`}
        >
          {!isSidebarOpen && <PanelLeftOpen size={20} />}
        </button>
        <span className="text-[#7C3AED] text-xl">✨</span>
        <button
          onClick={() => setIsVersionDropdownOpen(!isVersionDropdownOpen)}
          className={`${
            isDarkMode
              ? "text-white hover:bg-gray-800"
              : "text-black hover:bg-gray-200"
          } flex items-center gap-2 px-2 py-1 rounded-lg max-w-[140px] md:max-w-none overflow-hidden text-ellipsis whitespace-nowrap`}
        >
          <span>{selectedVersion}</span>
          <ChevronDown
            size={20}
            className={`${
              isDarkMode
                ? "text-white hover:bg-gray-800"
                : "text-black hover:bg-gray-200"
            } flex-shrink-0`}
          />
        </button>

        {/* Version Dropdown */}
        {isVersionDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-[#1F1F1F] rounded-lg shadow-lg border border-gray-800 py-1 z-30">
            {versions.map((version) => (
              <button
                key={version}
                onClick={() => handleVersionSelect(version)}
                className="w-full text-left px-4 py-2 hover:bg-gray-800 text-gray-300"
              >
                {version}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 md:gap-3">
        {token ? (
          <div className="relative">
            <button
              onClick={() => setActiveBarProfile((prev) => !prev)}
              className="relative px-3 md:px-4 py-2 bg-[#7C3AED] rounded-lg hover:bg-[#6D28D9] text-sm font-medium whitespace-nowrap"
            >
              Profile
            </button>

            <ul
              className={`absolute top-[100%] right-[10%] bg-white shadow-md rounded-md p-2 w-40 transition-all duration-300 ease-in-out transform ${
                activeBarProfile
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <li
                onClick={() => navigate("/refresh-password")}
                className="px-2 py-2 text-black cursor-pointer"
              >
                Refresh password
              </li>
            </ul>
          </div>
        ) : (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="px-3 md:px-4 py-2 bg-[#7C3AED] rounded-lg hover:bg-[#6D28D9] text-sm font-medium whitespace-nowrap"
          >
            Login
          </button>
        )}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-400"
        >
          {isDarkMode ? "🌞" : "🌙"}
        </button>
      </div>
    </header>
  );
};

export default Header;
