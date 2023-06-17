import MapOption from "@/components/user/MapOption";
import getDocument from "@/firebase/firestore/getDocument";
import Image from "next/image";
import { DocumentData } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import Layout from "@/components/common/Layout";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

interface UserDetailProps {
  paths: [{ latitude: number; longitude: number }[]];
  images: { urls: string[]; id: string }[];
  userId: string;
}

const UserDetail = ({ paths, images, userId }: UserDetailProps) => {
  const { nickname } = useUser(userId);

  return (
    <Layout>
      <div>
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

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const userId = context.query.userId as string;
  const userStoryResult = await getDocument("users", userId);
  if (!userStoryResult) return { notFound: true };

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
    props: { paths, images, userId },
  };
};
