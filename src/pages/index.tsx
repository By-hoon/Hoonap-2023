import admin from "@/firebase/adminConfig";
import { GetServerSidePropsContext } from "next/types";
import nookies from "nookies";
import Link from "next/link";
import Layout from "@/components/common/Layout";
import signIn from "@/firebase/auth/signIn";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { isExp } from "@/utils/util";
import { addInfo, expInfo } from "@/shared/constants";

export default function Home({ loggedIn, uid }: { loggedIn: boolean; uid: string }) {
  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);
  const [loading, setLoading] = useState(loggedIn);

  const router = useRouter();

  const tryLoginTestAccount = async () => {
    const result = await signIn(
      `${process.env.NEXT_PUBLIC_EXPERIENCE_AUTH_ID}`,
      `${process.env.NEXT_PUBLIC_EXPERIENCE_AUTH_PASSWORD}`
    );
    if (!result) return;
    router.replace("/");
  };

  useEffect(() => {
    if (isLoggedIn) return;

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setLoading(true);
      if (user) {
        setIsLoggedIn(true);
      }
    });
  }, []);

  if (!loading) return <></>;

  if (isExp(uid))
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
            <div className="text-[15px] text-white mt-[2px] px-[10px] py-[4px] bg-red-300">
              {addInfo.expRestrict}
            </div>
          </div>
        </div>
      </Layout>
    );

  if (!isLoggedIn)
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

  return <Layout>Home</Layout>;
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(context);
    const token = await admin.auth().verifyIdToken(cookies.token);
    const { uid } = token;
    return {
      props: { loggedIn: true, uid },
    };
  } catch (error) {
    return {
      props: { loggedIn: false },
    };
  }
};
