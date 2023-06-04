import MapOption from "@/components/user/MapOption";
import getDocument from "@/firebase/firestore/getDocument";
import Image from "next/image";
import { DocumentData } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

interface UserDetailProps {
  paths: [{ latitude: number; longitude: number }[]];
  images: { urls: string[]; id: string }[];
}

const UserDetail = ({ paths, images }: UserDetailProps) => {
  return (
    <div>
      <div>
        <Map>
          <MapOption paths={paths} />
        </Map>
      </div>
      <div className="flex">
        {images.map((image, index) =>
          image.urls.map((imageUrl) => (
            <figure key={imageUrl}>
              <Image
                src={imageUrl}
                alt="preview-image"
                width={150}
                height={150}
                style={{ width: 150, height: 150 }}
              />
            </figure>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDetail;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const userId = context.query.userId as string;
  const userStoryResult = await getDocument("users", userId);
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

  return {
    props: { paths: paths, images: images },
  };
};
