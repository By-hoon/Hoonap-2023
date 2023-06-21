import doSignOut from "@/firebase/auth/signOut";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const headerRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  const openSidebar = () => {
    setShowSidebar(true);
  };
  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const onClickOutSide = (e: any) => {
    if (showSidebar && headerRef.current && !headerRef.current.contains(e.target)) {
      closeSidebar();
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

  if (!mounted) return;
  if (isMobile)
    return (
      <div>
        <div ref={headerRef}>
          <div onClick={openSidebar}>
            <Icon icon="material-symbols:menu-rounded" />
          </div>
          {showSidebar ? (
            <div>
              {/* 그림자 배경용 div */}
              <div>
                <div>
                  <Icon icon="material-symbols:close" onClick={closeSidebar} />
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
    <div>
      <div>
        <Link href="/">Hoonap</Link>
      </div>
      <div>
        <div>
          <Link href="/story/list">스토리</Link>
        </div>
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
        <Link href="/create">생성</Link>
      </div>
    </div>
  );
};

export default Header;
