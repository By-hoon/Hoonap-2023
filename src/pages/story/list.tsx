import { GetServerSidePropsContext } from "next/types";
import dynamic from "next/dynamic";
import checkUser from "@/firebase/auth/checkUser";
import getDocument from "@/firebase/firestore/getDocument";
import MapOption from "@/components/list/MapOption";
import Preview from "@/components/story/Preview";
import { useState } from "react";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

interface ListProps {
  pathObjects: { pathArray: { latitude: number; longitude: number }[]; storyId: string }[];
  userId: string;
}

const List = ({ pathObjects, userId }: ListProps) => {
  const [currentStoryId, setCurrentStoryId] = useState<string | undefined>();
  return (
    <div>
      <Map>
        <MapOption pathObjects={pathObjects} setCurrentStoryId={setCurrentStoryId} />
      </Map>
      {currentStoryId ? <Preview currentStoryId={currentStoryId} userId={userId} /> : null}
    </div>
  );
};

export default List;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const userId = await checkUser(context);
  if (!userId)
    return {
      props: {} as never,
    };
  const usersResult = await getDocument("users", userId);
  if (!usersResult)
    return {
      props: {} as never,
    };
  const pathObjects: { pathArray: { latitude: number; longitude: number }[]; storyId: string }[] = [];
  const storyIds: string[] = [];

  const promises = usersResult.storyIds.map(async (storyId: string) => {
    const pathsResult = await getDocument("paths", storyId);
    if (!pathsResult) return;
    pathObjects.push({ pathArray: pathsResult.paths, storyId });
  });

  await Promise.all(promises);
  return {
    props: { pathObjects, userId },
  };
};
