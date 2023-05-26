import { GetServerSidePropsContext } from "next/types";
import dynamic from "next/dynamic";
import checkUser from "@/firebase/auth/checkUser";
import getDocument from "@/firebase/firestore/getDocument";
import MapOption from "@/components/list/MapOption";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

const List = ({ pathsArray }: { pathsArray: { latitude: number; longitude: number }[][] }) => {
  return (
    <div>
      <Map>
        <MapOption paths={pathsArray} />
      </Map>
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
  const pathsArray: { latitude: number; longitude: number }[][] = [];

  const promises = usersResult.storyIds.map(async (storyId: string) => {
    const pathsResult = await getDocument("paths", storyId);
    if (!pathsResult) return;
    pathsArray.push(pathsResult.paths);
  });

  await Promise.all(promises);
  return {
    props: { pathsArray },
  };
};
