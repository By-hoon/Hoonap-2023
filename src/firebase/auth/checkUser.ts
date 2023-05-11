import admin from "@/firebase/adminConfig";
import { GetServerSidePropsContext } from "next/types";
import nookies from "nookies";

export default async function checkUser(context: GetServerSidePropsContext) {
  try {
    const cookies = nookies.get(context);
    const token = await admin.auth().verifyIdToken(cookies.token);
    const { uid } = token;

    return uid;
  } catch (error) {
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return false;
  }
}
