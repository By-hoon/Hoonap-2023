import getDocument from "@/firebase/firestore/getDocument";
import Image from "next/image";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import Layout from "@/components/common/Layout";
import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import BasicImage from "@/components/common/BasicImage";
import dynamic from "next/dynamic";
import MapOption from "@/components/MapOption";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

const UserDetail = () => {
  const [paths, setPaths] = useState<[{ latitude: number; longitude: number }[]]>([[]]);
  const [storyIds, setStoryIds] = useState<string[]>([]);
  const [images, setImages] = useState<{ urls: string[]; id: string }[]>([]);

  const router = useRouter();
  const { userId } = router.query;

  const { nickname } = useUser(userId as string);

  const clickMap = (storyId?: string) => {
    if (!storyId) return;
    Router.push({
      pathname: "/story/detail",
      query: { storyId: storyId },
    });
  };

  useEffect(() => {
    if (!userId) {
      alert("사용자 정보가 없습니다.");
      Router.push("/story/list");
      return;
    }

    const getUserData = async () => {
      const userStoryResult = await getDocument("users", userId as string);

      if (!userStoryResult) return;

      const paths: [{ latitude: number; longitude: number }[]] = [[]];
      const storyIds: string[] = [];
      const images: { urls: string[]; id: string }[] = [];

      const promises = userStoryResult.storyIds.map(async (storyId: string) => {
        const storyResult = await getDocument("stories", storyId);
        if (!storyResult) return;
        paths.push(storyResult.paths);
        storyIds.push(storyId);
        images.push({ urls: storyResult.images, id: storyId });
      });

      await Promise.all(promises);
      paths.shift();

      setPaths(paths);
      setStoryIds(storyIds);
      setImages(images);
    };
    getUserData();
  }, [userId]);

  if (!userId)
    return (
      <Layout>
        <div></div>
      </Layout>
    );
  return (
    <Layout>
      <div className="w-full max-w-[768px] min-w-[320px] mx-auto my-0">
        <div className="border-b-2 p-[15px]">
          <div className="text-[18px] font-semibold">{nickname}</div>
        </div>
        <div className="main-relative">
          <div className="main-absolute">
            {paths[0][0] ? (
              <Map location={{ latitude: paths[0][0].latitude, longitude: paths[0][0].longitude }}>
                <MapOption
                  paths={paths.map((path, index) => ({ pathArray: path, storyId: storyIds[index] }))}
                  clickMap={clickMap}
                />
              </Map>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap justify-around p-[5px]">
          {images.map((image) =>
            image.urls.map((imageUrl) => (
              <Link
                key={imageUrl}
                href={{
                  pathname: "/story/detail",
                  query: { storyId: image.id },
                }}
                as="/story/detail"
              >
                <BasicImage
                  style={"relative w-[130px] h-[130px] rounded-[5px] border-2 mx-[5px] my-[10px] p-[5px]"}
                  url={imageUrl}
                  alt={"user-story-image"}
                />
              </Link>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserDetail;
