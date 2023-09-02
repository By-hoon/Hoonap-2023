import dynamic from "next/dynamic";
import getDocument from "@/firebase/firestore/getDocument";
import MapOption from "@/components/list/MapOption";
import Preview from "@/components/story/Preview";
import { useEffect, useState } from "react";
import Layout from "@/components/common/Layout";
import { isExp } from "@/utils/util";
import { useAuth } from "@/context/authProvoider";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

type pathObjects = { pathArray: { latitude: number; longitude: number }[]; storyId: string }[];

const List = () => {
  const [currentStoryId, setCurrentStoryId] = useState<string | undefined>();
  const [paths, setPaths] = useState<pathObjects>([]);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const getUserResult = async () => {
      const usersResult = await getDocument("users", user.uid);
      return usersResult ? usersResult : false;
    };

    const getPathData = async () => {
      const usersResult = await getUserResult();
      if (!usersResult) return console.log("user result error");

      const pathObjects: pathObjects = [];

      if (!usersResult.storyIds) {
        alert("게시된 스토리가 없습니다.");
        return;
      }
      const promises = usersResult.storyIds.map(async (storyId: string) => {
        const pathsResult = await getDocument("paths", storyId);
        if (!pathsResult) return;
        pathObjects.push({ pathArray: pathsResult.paths, storyId });
      });

      await Promise.all(promises);
      setPaths(pathObjects);
    };

    const getExpPathData = () => {
      const storagePath = window.localStorage.getItem("path");
      if (!storagePath) {
        alert("게시된 스토리가 없습니다.");
        return;
      }

      const expPath = JSON.parse(storagePath);
      const pathObjects: pathObjects = [];

      Object.keys(expPath).forEach((key) => {
        pathObjects.push({ pathArray: expPath[key].paths, storyId: expPath[key].storyId });
      });
      setPaths(pathObjects);
    };

    if (isExp(user.uid)) {
      getExpPathData();
      return;
    }

    getPathData();
  }, [user]);

  if (!user)
    return (
      <Layout>
        <div></div>
      </Layout>
    );

  return (
    <Layout>
      <div className="p-[10px]">
        <div className="grid grid-cols-[minmax(420px,_1fr)_1fr]">
          <div className="main-relative">
            <div className="main-absolute">
              <Map>
                <MapOption paths={paths} setCurrentStoryId={setCurrentStoryId} />
              </Map>
            </div>
          </div>
          <div className="flex items-center p-[15px]">
            {currentStoryId ? <Preview currentStoryId={currentStoryId} userId={user.uid} /> : null}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default List;
