import Link from "next/link";

const Welcome = () => {
  return (
    <div>
      <div>Hoonap에 오신것을 환영합니다 !</div>
      <div>
        <Link href="/">서비스 이용 시작</Link>
      </div>
    </div>
  );
};

export default Welcome;
