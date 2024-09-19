import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import pencilIcon from "../Icon/pencil logo purple.png";
import { useUser } from "../context/UserContext";

import { AccountPopover } from "../layouts/components/account-popover";
import { Iconify } from "../dashboardComponents/iconify";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("isDarkMode") === "true";
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });

  const [isHeaderShow, setHeaderShow] = useState(true); // 헤더 가시성 상태
  const [lastScrollY, setLastScrollY] = useState(0); // 스크롤 마지막 위치 저장

  const navigate = useNavigate();
  const { user, setUser } = useUser(); // UserContext에서 user 가져오기

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY; // 현재 스크롤 위치

      if (currentScrollY > lastScrollY && currentScrollY > 30) {
        // 스크롤을 아래로 내리는 중이며, 30 이상일 때
        setHeaderShow(false); // 헤더 숨기기
      } else {
        // 스크롤을 위로 올리거나, 30 이하일 때
        setHeaderShow(true); // 헤더 보이기
      }

      setLastScrollY(currentScrollY); // 마지막 스크롤 위치 업데이트
    };

    window.addEventListener("scroll", handleScroll); // 스크롤 이벤트 추가

    return () => {
      window.removeEventListener("scroll", handleScroll); // 컴포넌트 언마운트 시 이벤트 제거
    };
  }, [lastScrollY]); // lastScrollY 변화에 따라 스크롤 이벤트 트리거

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

  // 다크 모드 토글 함수
  const DarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // 다크 모드 및 라이트 모드 테마 생성
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isHeaderShow && ( // 헤더가 보여질 때만 렌더링
        <header className="sticky top-0 z-50 flex justify-between items-center w-full p-10 dark:bg-scampi-800">
          <Link to="/home">
            <button className="flex items-center text-xl bg-transparent text-scampi-700 dark:text-scampi-200 py-2 px-4 rounded-full hover:bg-scampi-300 dark:hover:bg-scampi-700 cursor-pointer transition-colors font-bold w-36 h-12 justify-center">
              <img
                src={pencilIcon}
                className="w-8 h-8 mr-2"
                alt="Pencil Icon"
              />{" "}
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

            {isLoggedIn ? (
              // AccountPopover
              <AccountPopover
                data={[
                  {
                    label: "대시보드",
                    href: "/dashboard",
                    icon: (
                      <Iconify
                        width={22}
                        icon="solar:home-angle-bold-duotone"
                      />
                    ),
                  },
                  {
                    label: "다크모드",
                    href: "#",
                    icon: (
                      <Iconify
                        width={22}
                        icon="solar:shield-keyhole-bold-duotone"
                        onClick={DarkMode}
                      />
                    ),
                  },
                  {
                    label: "회원정보수정",
                    href: "#",
                    icon: (
                      <Iconify width={22} icon="solar:settings-bold-duotone" />
                    ),
                  },
                ]}
              />
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
      )}
    </ThemeProvider>
  );
};

export default Header;
