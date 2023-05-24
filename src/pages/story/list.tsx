import { GetServerSidePropsContext } from "next/types";
import dynamic from "next/dynamic";
import checkUser from "@/firebase/auth/checkUser";
import getDocument from "@/firebase/firestore/getDocument";
import { DocumentData } from "firebase/firestore";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

const List = ({ paths }: { paths: { latitude: number; longitude: number }[] }) => {
  return (
    <div>
      <Map paths={paths} />
    </div>
  );
};

export default List;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const uid = await checkUser(context);
  if (!uid)
    return {
      props: {} as never,
    };
  const usersResult = await getDocument("users", uid);
  if (!usersResult)
    return {
      props: {} as never,
    };
  const paths: { latitude: number; longitude: number }[] = [];

  const promises = usersResult.storyIds.map(async (storyId: string) => {
    const pathsResult = await getDocument("paths", storyId);
    if (!pathsResult) return;
    paths.push(pathsResult.paths);
  });

  await Promise.all(promises);

  return {
    props: { paths },
  };
};
