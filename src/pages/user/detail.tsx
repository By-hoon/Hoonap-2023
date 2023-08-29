import MapOption from "@/components/user/MapOption";
import getDocument from "@/firebase/firestore/getDocument";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import Layout from "@/components/common/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
    if (!userId) return;

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

      setPaths(paths);
      setImages(images);
    };
    getUserData();
  }, [userId]);

  if (!userId) return;

  return (
    <Layout>
      <div className="w-[300px] h-[300px]">
        <Map>
          <MapOption paths={paths} />
        </Map>
      </div>
      <div>
        <div>{nickname}</div>
      </div>
      <div className="flex">
        {images.map((image) =>
          image.urls.map((imageUrl) => (
            <figure key={imageUrl}>
              <Link
                href={{
                  pathname: "/story/detail",
                  query: { storyId: image.id },
                }}
                as="/story/detail"
              >
                <Image
                  src={imageUrl}
                  alt="preview-image"
                  width={150}
                  height={150}
                  style={{ width: 150, height: 150 }}
                />
              </Link>
            </figure>
          ))
        )}
      </div>
    </Layout>
  );
};

export default UserDetail;
