import getDocument from "@/firebase/firestore/getDocument";
import { GetServerSidePropsContext } from "next";

const UserDetail = () => {
  return <div>사용자 정보</div>;
};

export default UserDetail;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const userId = context.query.userId as string;
  const result = await getDocument("users", userId);
  if (!result) return;

  return {
    props: {},
  };
};
