import doSignOut from "@/firebase/auth/signOut";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

const Header = () => {
  const [showSidebar, setShowSidebar] = useState(false);

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

  if (isMobile)
    return (
      <div>
        <div>
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
