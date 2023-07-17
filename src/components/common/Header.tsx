import doSignOut from "@/firebase/auth/signOut";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Title from "./Title";
import { title } from "@/shared/constants";
import useClickOutside from "@/hooks/useClickOutside";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { show: showSidebar, ref: sidebarRef, onClickTarget: onClickSidebar } = useClickOutside();
  const { show: showProfileMenu, ref: profileMenuRef, onClickTarget: onClickProfileMenu } = useClickOutside();

  const router = useRouter();
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  const onClickOutSide = (e: any) => {
    if (showSidebar && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      onClickSidebar();
    }
    if (showProfileMenu && profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
      onClickProfileMenu();
    }
  };

  useEffect(() => {
    document.addEventListener("click", onClickOutSide);
    return () => {
      document.removeEventListener("click", onClickOutSide);
    };
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const titleRender = () => {
    switch (router.pathname) {
      case "/create": {
        return <Title title={title.create} />;
      }
      case "/story/detail": {
        return <Title title={title.story} />;
      }
      case "/story/list": {
        return <Title title={title.stories} />;
      }
      case "/gallery": {
        return <Title title={title.gallery} />;
      }
      default:
        return null;
    }
  };

  if (!mounted) return <></>;
  if (isMobile)
    return (
      <div>
        <div ref={sidebarRef}>
          <div onClick={onClickSidebar}>
            <Icon icon="material-symbols:menu-rounded" />
          </div>
          {showSidebar ? (
            <div>
              {/* 그림자 배경용 div */}
              <div>
                <div>
                  <Icon icon="material-symbols:close" onClick={onClickSidebar} />
                </div>
                <div>
                  <Link href="/">Hoonap</Link>
                </div>
                <div>
                  <div>프로필</div>
                  <div
                    onClick={() => {
                      doSignOut();
                      router.replace("/login");
                    }}
                  >
                    로그아웃
                  </div>
                </div>
                <div>
                  <Link href="/story/list">스토리</Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div>
          <Link href="/">Hoonap</Link>
        </div>
        <div>
          <Link href="/create">생성</Link>
        </div>
      </div>
    );

  return (
    <div className="fixed top-0 left-0 w-[100%] h-[70px] px-[10px] border-b-2 border-bs bg-white z-[100]">
      <div className="flex justify-between max-w-[1200px] h-[100%] mx-auto my-0">
        <div className="flex">
          <div className="pt-[12px]">
            <Link href="/" className="font-extrabold text-[24px]">
              Hoonap
            </Link>
          </div>
          <div className="flex justify-between items-center w-[120px] font-semibold text-[18px] ml-[20px]">
            <div>
              <Link href="/story/list" className="hover:text-bc">
                스토리
              </Link>
            </div>
            <div>
              <Link href="/gallery" className="hover:text-bc">
                갤러리
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-end font-semibold text-[18px] px-[10px] pb-[10px]">{titleRender()}</div>
        <div className="flex items-center">
          <div ref={profileMenuRef} className="relative flex  font-semibold text-[18px] mr-[30px]">
            <div className="cursor-pointer" onClick={onClickProfileMenu}>
              프로필
            </div>
            {showProfileMenu ? (
              <div className="absolute top-[30px] left-[-12px] w-[80px] h-[60px] text-center font-normal text-[15px] bg-white rounded-[6px] shadow-basic p-[3px]">
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    doSignOut();
                    router.replace("/login");
                  }}
                >
                  로그아웃
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex justify-center items-center w-[65px] h-[40px] font-medium text-[16px] text-white rounded-[5px] bg-bc">
            <Link href="/create">생성</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
