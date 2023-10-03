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
      case "/user/detail": {
        return <Title title={title.user} />;
      }
      default:
        return null;
    }
  };

  if (!mounted) return <></>;
  if (isMobile)
    return (
      <div className="header h-[55px] flex justify-between items-center">
        <div>
          <div className="w-[58px] text-[24px]" onClick={onClickSidebar} ref={sidebarRef}>
            <Icon icon="material-symbols:menu-rounded" />
          </div>
          {showSidebar ? (
            <div className="absolute top-0 left-0 w-full h-[100vh] bg-bs/50">
              <div className="w-[200px] h-full bg-white p-[10px] animate-appearSidebar">
                <div className="absolute top-[5px] right-[5px] text-[20px]">
                  <Icon icon="material-symbols:close" onClick={onClickSidebar} />
                </div>
                <div className="text-[22px] font-semibold mb-[15px]">
                  <Link href="/">Hoonap</Link>
                </div>
                <div className="text-[18px] mb-[15px]">
                  <div className="mb-[5px]">
                    <span>프로필</span>
                  </div>
                  <div>
                    <span
                      onClick={() => {
                        doSignOut();
                        router.replace("/login");
                      }}
                    >
                      로그아웃
                    </span>
                  </div>
                </div>
                <div className="text-[18px] mb-[15px]">
                  <Link href="/story/list">스토리</Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="text-[22px] font-semibold">
          <Link href="/">Hoonap</Link>
        </div>
        <div>
          <Link href="/create" className="submit-button text-[15px] px-[14px] py-[8px]">
            생성
          </Link>
        </div>
      </div>
    );

  return (
    <div className="header">
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
