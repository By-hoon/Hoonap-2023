import doSignOut from "@/firebase/auth/signOut";
import Link from "next/link";

const Header = () => {
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
        <div onClick={doSignOut}>로그아웃</div>
      </div>
      <div>
        <Link href="/create">생성</Link>
      </div>
    </div>
  );
};

export default Header;
