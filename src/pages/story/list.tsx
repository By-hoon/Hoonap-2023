import dynamic from "next/dynamic";
import getDocument from "@/firebase/firestore/getDocument";
import MapOption from "@/components/list/MapOption";
import Preview from "@/components/story/Preview";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import Layout from "@/components/common/Layout";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

type pathObjects = { pathArray: { latitude: number; longitude: number }[]; storyId: string }[];

const List = () => {
  const [currentStoryId, setCurrentStoryId] = useState<string | undefined>();
  const [paths, setPaths] = useState<pathObjects>([]);
  const [userId, setUserId] = useState("");

  const router = useRouter();

  const getUserResult = async () => {
    const usersResult = await getDocument("users", userId);
    return usersResult ? usersResult : false;
  };
  const getPathData = async () => {
    const usersResult = await getUserResult();
    if (!usersResult) return console.log("user result error");

    const pathObjects: pathObjects = [];
    const promises = usersResult.storyIds.map(async (storyId: string) => {
      const pathsResult = await getDocument("paths", storyId);
      if (!pathsResult) return;
      pathObjects.push({ pathArray: pathsResult.paths, storyId });
    });

    await Promise.all(promises);
    setPaths(pathObjects);
  };

  useEffect(() => {
    if (userId !== "") getPathData();
  }, [userId]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.uid);
    });
  }, []);

  if (userId === "") return;
  return (
    <Layout>
      <div className="p-[10px]">
        <div className="grid grid-cols-[minmax(420px,_1fr)_1fr]">
          <div className="relative after:block after:pb-[100%]">
            <div className="absolute w-[100%] h-[100%] mx-auto my-0 p-[15px]">
              <Map>
                <MapOption paths={paths} setCurrentStoryId={setCurrentStoryId} />
              </Map>
            </div>
          </div>
          <div className="flex items-center p-[15px]">
            {currentStoryId ? <Preview currentStoryId={currentStoryId} userId={userId} /> : null}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default List;
