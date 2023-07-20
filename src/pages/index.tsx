import admin from "@/firebase/adminConfig";
import { GetServerSidePropsContext } from "next/types";
import nookies from "nookies";
import Link from "next/link";
import Layout from "@/components/common/Layout";
import signIn from "@/firebase/auth/signIn";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Home({ loggedIn, uid }: { loggedIn: boolean; uid: string }) {
  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);
  const [loading, setLoading] = useState(loggedIn);

  const router = useRouter();

  const tryLoginTestAccount = async () => {
    const result = await signIn("test@test.com", "test123");
    if (!result) return;
    router.replace("/");
  };

  useEffect(() => {
    if (isLoggedIn) return;

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(true);
        setIsLoggedIn(true);
      }
    });
  }, []);

  if (!loading) return <></>;

  if (!isLoggedIn)
    return (
      <div>
        <div>안내문구</div>
        <Link href="/login">
          <button>로그인</button>
        </Link>
        <div>
          <button onClick={tryLoginTestAccount}>체험하기</button>
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
