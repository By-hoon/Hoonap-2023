import Link from "next/link";
import Layout from "@/components/common/Layout";
import signIn from "@/firebase/auth/signIn";
import { useRouter } from "next/router";
import { isExp } from "@/utils/util";
import { addInfo, expInfo } from "@/shared/constants";
import { useAuth } from "@/context/authProvoider";

export default function Home() {
  const { user } = useAuth();

  const router = useRouter();

  const tryLoginTestAccount = async () => {
    const result = await signIn(
      `${process.env.NEXT_PUBLIC_EXPERIENCE_AUTH_ID}`,
      `${process.env.NEXT_PUBLIC_EXPERIENCE_AUTH_PASSWORD}`
    );
    if (!result) return;
    router.replace("/");
  };

  if (!user)
    return (
      <div className="max-w-[768px] min-w-[320px] mx-auto p-[5px]">
        <div className="text-center text-[22px] md:text-[24px] font-semibold">Hoonap 방문을 환영합니다 !</div>
        <div className="flex justify-between w-[190px] mx-auto mt-[20px]">
          <Link href="/signup">
            <button className="submit-button px-[15px]">회원가입</button>
          </Link>
          <Link href="/login">
            <button className="submit-button">로그인</button>
          </Link>
        </div>
        <div className="text-center mt-[40px]">미리 서비스를 사용해 보고 싶다면?</div>
        <div className="mt-[10px] text-center">
          <button className="submit-button bg-gray-400 hover:bg-gray-500" onClick={tryLoginTestAccount}>
            체험하기
          </button>
        </div>
      </div>
    );

  if (isExp(user.uid))
    return (
      <Layout>
        <div className="w-[300px] p-[10px] mx-[auto]">
          <div className="text-[22px] font-semibold text-center my-[20px]">{addInfo.expSubtitle}</div>
          <div>
            {expInfo.map((info, index) => (
              <div key={index} className="text-[17px] mt-[10px] break-keep">
                {info}
              </div>
            ))}
            <div className="flex flex-wrap">
              {addInfo.expRestricts.map((restrict, index) => (
                <div
                  key={index}
                  className="text-[15px] text-white mx-[2px] mt-[2px] px-[10px] py-[4px] bg-red-300"
                >
                  {restrict}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );

  return <Layout>Home</Layout>;
}
