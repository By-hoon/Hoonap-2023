import admin from "@/firebase/adminConfig";
import { GetServerSidePropsContext } from "next/types";
import nookies from "nookies";
import Header from "@/components/common/Header";
import Link from "next/link";
import Layout from "@/components/common/Layout";

export default function Home({ loggedIn, uid }: { loggedIn: boolean; uid: string }) {
  if (!loggedIn)
    return (
      <div>
        <div>안내문구</div>
        <Link href="/login">
          <button>로그인</button>
        </Link>
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
