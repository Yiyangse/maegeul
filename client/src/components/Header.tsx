import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import pencilIcon from "../Icon/pencil logo purple.png";
import { useUser } from "../context/UserContext";

const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("isDarkMode") === "true";
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });
  const navigate = useNavigate();

  const { user, setUser } = useUser(); // UserContext에서 user 가져오기

  console.log(user);

  useEffect(() => {
    // 다크 모드 초기 설정 적용
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    // `storage` 이벤트를 통해 다른 탭에서 토큰이 변경될 때 상태 업데이트
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("isDarkMode", newMode.toString());
      if (newMode) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
      return newMode;
    });
  };

  const handleLogout = () => {
    // 로그아웃 시 localStorage에서 토큰 삭제 및 상태 업데이트
    localStorage.removeItem("token");
    setIsLoggedIn(false); // 로그인 상태를 false로 설정
    setUser(null); // 사용자 정보를 초기화하여 profile_name 제거
    navigate("/"); // 로그아웃 후 메인 페이지로 리다이렉트
  };

  const [isDropdownVisible, setDropdownVisible] = useState(false); // 드롭다운 메뉴 표시 여부

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev); // 드롭다운 표시/숨기기 토글
  };

  // 외부 클릭 시 드롭다운을 닫는 기능 추가
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest("#profileButton")) {
      setDropdownVisible(false); // 프로필 버튼 외부를 클릭하면 드롭다운을 닫음
    }
  };

  useEffect(() => {
    if (isDropdownVisible) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownVisible]);

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center w-full p-10 dark:bg-scampi-800">
      <Link to="/home">
        <button className="flex items-center text-xl bg-transparent text-scampi-700 dark:text-scampi-200 py-2 px-4 rounded-full hover:bg-scampi-300 dark:hover:bg-scampi-700 cursor-pointer transition-colors font-bold w-36 h-12 justify-center">
          <img src={pencilIcon} className="w-8 h-8 mr-2" alt="Pencil Icon" />{" "}
          MAEGEUL
        </button>
      </Link>

      <nav className="flex gap-2">
        <Link to="/maegeul">
          <button className="text-sm bg-transparent text-scampi-700 dark:text-scampi-200 py-2 px-4 rounded-full hover:bg-scampi-300 dark:hover:bg-scampi-700 cursor-pointer transition-colors">
            매일 글쓰기
          </button>
        </Link>
        <Link to="/emotionForm">
          <button className="text-sm bg-transparent text-scampi-700 dark:text-scampi-200 py-2 px-4 rounded-full hover:bg-scampi-300 dark:hover:bg-scampi-700 cursor-pointer transition-colors">
            AI 하루진단
          </button>
        </Link>
        <Link to="/blog">
          <button className="text-sm bg-transparent text-scampi-700 dark:text-scampi-200 py-2 px-4 rounded-full hover:bg-scampi-300 dark:hover:bg-scampi-700 cursor-pointer transition-colors">
            추천 아티클
          </button>
        </Link>
      </nav>

      <nav className="flex gap-7 items-center">
        <button
          onClick={toggleDarkMode}
          className="bg-scampi-500 dark:bg-scampi-600 text-white py-2 px-4 rounded-full shadow-md hover:bg-scampi-400 dark:hover:bg-scampi-700 transition-colors"
        >
          {isDarkMode ? "🔆" : "🌙"}
        </button>

        {/* 프로필 사진 */}

        {isLoggedIn ? (
          <div className="relative" id="profileButton" onClick={toggleDropdown}>
            {user?.isKakaoUser && user?.profile_picture ? (
              <img
                className="inline-block w-[50px] h-[50px] rounded-full cursor-pointer"
                src={user.profile_picture}
                alt="카카오 프로필 사진"
              />
            ) : user?.profile_picture ? (
              <img
                className="inline-block w-[50px] h-[50px] rounded-full cursor-pointer"
                src={`http://localhost:5000${user.profile_picture}`}
                alt="로컬 프로필 사진"
              />
            ) : (
              <svg
                className="inline-block w-[50px] h-[50px] rounded-full bg-gray-200 cursor-pointer"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                ></path>
              </svg>
            )}
            {/* <span className="ml-2">{user?.profile_name || "Guest"}</span> */}

            {/* 드롭다운 메뉴 */}
            {isDropdownVisible && (
              <div
                id="userDropdown"
                className="absolute right-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
              >
                <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  <div>{user?.profile_name || "Guest"}</div>
                  <div className="font-medium truncate">
                    {user?.email || "이메일 없음"}
                  </div>
                </div>
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="avatarButton"
                >
                  <li>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/earnings"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Earnings
                    </Link>
                  </li>
                </ul>
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-scampi-500 dark:bg-scampi-600 text-white py-2 px-4 rounded-full shadow-md hover:bg-scampi-400 dark:hover:bg-scampi-700 transition-colors"
          >
            로그아웃
          </button>
        ) : (
          <Link to="/mainlogin">
            <button className="bg-scampi-500 dark:bg-scampi-600 text-white py-2 px-4 rounded-full shadow-md hover:bg-scampi-400 dark:hover:bg-scampi-700 transition-colors">
              로그인
            </button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
