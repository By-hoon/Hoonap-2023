import doSignOut from "@/firebase/auth/signOut";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Title from "./Title";
import useClickOutside from "@/hooks/useClickOutside";
import { PopUpContext } from "@/context/popUpProvider";
import { useAuth } from "@/context/authProvider";
import useUser from "@/hooks/useUser";
import ProfileImage from "../user/ProfileImage";
import { ALERT_CONTENT, CONFIRM_CONTENT, CONFIRM_TITLE, TITLE } from "@/shared/constants";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { show: showSidebar, ref: sidebarRef, onClickTarget: onClickSidebar } = useClickOutside();
  const { show: showProfileMenu, ref: profileMenuRef, onClickTarget: onClickProfileMenu } = useClickOutside();

  const { user } = useAuth();
  const { nickname, profileImage } = useUser(user?.uid);
  const { alert, confirm } = useContext(PopUpContext);

  const router = useRouter();

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  const trySignOut = async () => {
    const result = await confirm(CONFIRM_TITLE.SIGN_OUT, CONFIRM_CONTENT.SIGN_OUT);
    if (!result) return;

    doSignOut(
      () => {
        alert("", ALERT_CONTENT.SUCCESS_SIGNOUT);
        router.push("/login");
      },
      () => {
        alert("", ALERT_CONTENT.FAILED_SIGNOUT);
      }
    );
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const titleRender = () => {
    switch (router.pathname) {
      case "/create": {
        return <Title title={TITLE.CREATE} />;
      }
      case "/story/detail": {
        return <Title title={TITLE.STORY} />;
      }
      case "/story/list": {
        return <Title title={TITLE.STORIES} />;
      }
      case "/story/edit": {
        return <Title title={TITLE.EDIT_STORY} />;
      }
      case "/gallery": {
        return <Title title={TITLE.GALLERY} />;
      }
      case "/user/detail": {
        return <Title title={TITLE.USER} />;
      }
      case "/user/story": {
        return <Title title={TITLE.USER_STORY} />;
      }
      case "/user/edit": {
        return <Title title={TITLE.USER_EDIT} />;
      }
      case "/user/search": {
        return <Title title={TITLE.USER_SEARCH} />;
      }
      case "/user/log": {
        return <Title title={TITLE.USER_LOG} />;
      }
      default:
        return null;
    }
  };

  if (!mounted) return <></>;
  if (isMobile)
    return (
      <div className="header h-[45px] flex justify-between items-center">
        <div>
          <div className="w-[100px] text-[24px]" onClick={onClickSidebar} ref={sidebarRef}>
            <Icon icon="material-symbols:menu-rounded" />
          </div>
          {showSidebar ? (
            <div className="absolute top-0 left-0 w-full h-[100vh] bg-bs/50">
              <div className="w-[200px] h-full bg-white p-[10px] animate-appearSidebar">
                <div className="absolute top-[5px] right-[5px] text-[20px]">
                  <Icon icon="material-symbols:close" onClick={onClickSidebar} />
                </div>
                <div className="text-[22px] font-semibold mb-[20px]">
                  <Link href="/">Hoonap</Link>
                </div>
                <div className="mb-[10px]">
                  <ProfileImage
                    imageUrl={profileImage}
                    nickname={nickname}
                    style={"w-[100px] h-[100px] text-[28px] mx-auto my-[5px]"}
                  />
                  <div className="text-[17px] font-semibold my-[5px]">{nickname}</div>
                  <div className="text-[16px]">
                    <div className="px-[5px] py-[3px]">
                      <span
                        onClick={() => {
                          router.push(
                            {
                              pathname: "/user/detail",
                              query: { userId: user?.uid },
                            },
                            "/user/detail"
                          );
                        }}
                      >
                        내 정보
                      </span>
                    </div>
                    <div className="px-[5px] py-[3px]">
                      <span onClick={trySignOut}>로그아웃</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap text-[18px] mb-[15px]">
                  <div className="w-full my-[5px]">
                    <Link href="/story/list">스토리</Link>
                  </div>
                  <div className="w-full my-[5px]">
                    <Link href="/gallery">갤러리</Link>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="text-[22px] font-semibold">
          <Link href="/">Hoonap</Link>
        </div>
        <div className="w-[100px] flex flex-wrap justify-end">
          <div
            className="cursor-pointer text-[24px] mr-[8px]"
            onClick={() => {
              router.push("/user/search");
            }}
          >
            <Icon icon="ic:baseline-search" />
          </div>
          <div>
            <Link href="/create" className="submit-button text-[14px] px-[11px] py-[6px]">
              생성
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="header">
      <div className="grid grid-cols-[1fr_1fr_1fr] max-w-[1200px] h-[100%] mx-auto my-0">
        <div className="flex justify-start">
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
        <div className="flex justify-center items-end font-semibold text-[18px] px-[10px] pb-[10px]">
          {titleRender()}
        </div>
        <div className="flex justify-end items-center">
          <div
            className="cursor-pointer text-[24px] mr-[10px]"
            onClick={() => {
              router.push("/user/search");
            }}
          >
            <Icon icon="ic:baseline-search" />
          </div>
          <div ref={profileMenuRef} className="relative flex  font-semibold text-[18px] mr-[30px]">
            <div className="cursor-pointer" onClick={onClickProfileMenu}>
              프로필
            </div>
            {showProfileMenu ? (
              <div className="absolute top-[35px] right-0 w-[160px] font-normal bg-white rounded-[6px] shadow-basic py-[5px]">
                <ProfileImage
                  imageUrl={profileImage}
                  nickname={nickname}
                  style={"w-[100px] h-[100px] text-[28px] mx-auto my-[5px]"}
                />
                <div className="font-semibold break-all py-[5px] px-[7px]">{nickname}</div>
                <div className="text-[16px]">
                  <div
                    className="header-menu-button"
                    onClick={() => {
                      router.push(
                        {
                          pathname: "/user/detail",
                          query: { userId: user?.uid },
                        },
                        "/user/detail"
                      );
                    }}
                  >
                    내 정보
                  </div>
                  <div className="header-menu-button" onClick={trySignOut}>
                    로그아웃
                  </div>
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
