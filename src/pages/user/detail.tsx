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
  const [images, setImages] = useState<{ urls: string[]; id: string }[]>([]);

  const router = useRouter();
  const { userId } = router.query;

  const { nickname } = useUser(userId as string);

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
      const images: { urls: string[]; id: string }[] = [];

      const promises = userStoryResult.storyIds.map(async (storyId: string) => {
        const storyResult = await getDocument("stories", storyId);
        if (!storyResult) return;
        paths.push(storyResult.paths);
        images.push({ urls: storyResult.images, id: storyId });
      });

      await Promise.all(promises);
      paths.shift();

      setPaths(paths);
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
      <div>
        <div>{nickname}</div>
      </div>
      <div className="w-[300px] h-[300px]">
        <Map>
          <MapOption paths={paths.map((path) => ({ pathArray: path }))} />
        </Map>
      </div>
      <div className="flex">
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
                style={"relative w-[100px] h-[100px] rounded-[5px] border-2 mx-[5px] my-[10px] p-[5px]"}
                url={imageUrl}
                alt={"user-story-image"}
              />
            </Link>
          ))
        )}
      </div>
    </Layout>
  );
};

export default UserDetail;
