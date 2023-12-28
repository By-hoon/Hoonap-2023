import { useEffect, useState } from "react";
import getDocument from "@/firebase/firestore/getDocument";
import Layout from "@/components/common/Layout";
import Router, { useRouter } from "next/router";
import { isExp } from "@/utils/util";
import { useAuth } from "@/context/authProvider";
import DetailView from "@/components/story/DetailView";
import withHead from "@/components/hoc/withHead";
import { headDescription, headTitle } from "@/shared/constants";

export interface StoryProps {
  title: string;
  story: string;
  paths: { latitude: number; longitude: number }[];
  images: string[];
  createdAt: number;
  storyId: string;
  userId: string;
}

const StoryDetail = () => {
  const [story, setStory] = useState<StoryProps>();

  const { user } = useAuth();
  const router = useRouter();

  const { storyId } = router.query;

  useEffect(() => {
    if (!user) return;

    if (!storyId) {
      alert("스토리 정보가 없습니다.");
      Router.push("/story/list");
      return;
    }

    const getStory = async () => {
      const result = await getDocument("stories", storyId as string);

      if (!result) return;

      setStory({
        title: result.title,
        story: result.story,
        paths: result.paths,
        images: result.images,
        createdAt: result.createdAt,
        storyId: storyId as string,
        userId: result.userId,
      });
    };

    const getExpStory = () => {
      const storageStory = window.localStorage.getItem("story");
      if (!storageStory) return;

      const expStory = JSON.parse(storageStory);
      const result: StoryProps = expStory[storyId as string];

      setStory({
        title: result.title,
        story: result.story,
        paths: result.paths,
        images: result.images,
        createdAt: result.createdAt,
        storyId: storyId as string,
        userId: result.userId,
      });
    };

    if (isExp(user.uid)) {
      getExpStory();
      return;
    }
    getStory();
  }, [storyId, user]);

  if (!user || !story)
    return (
      <Layout>
        <div></div>
      </Layout>
    );

  return (
    <Layout>
      <div className="p-[10px]">
        <DetailView story={story} />
      </div>
    </Layout>
  );
};

export default withHead(StoryDetail, headTitle.storyDetail, headDescription.storyDetail);
