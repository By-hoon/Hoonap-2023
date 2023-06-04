import getDocument from "@/firebase/firestore/getDocument";
import { DocumentData } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";

interface UserDetailProps {
  paths: [{ latitude: number; longitude: number }[]];
  images: { urls: string[]; id: string }[];
}

const UserDetail = ({ paths, images }: UserDetailProps) => {
  console.log(paths, images);
  return <div>사용자 정보</div>;
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
