import Layout from "@/components/common/Layout";
import DetailView from "@/components/story/DetailView";
import { StoryProps } from "../story/detail";
import router from "next/router";
import { useEffect, useState } from "react";
import getDocument from "@/firebase/firestore/getDocument";

const Story = () => {
  const [story, setStory] = useState<StoryProps>();

  const { storyId } = router.query;

  useEffect(() => {
    if (!storyId) {
      alert("스토리 정보가 없습니다.");
      router.push("/story/list");
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
        storyId: storyId as string,
        userId: result.userId,
      });
    };

    getStory();
  }, [storyId]);

  if (!story) {
    return (
      <Layout>
        <div></div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-[10px]">
        <DetailView
          title={story.title}
          story={story.story}
          paths={story.paths}
          images={story.images}
          storyId={story.storyId}
          userId={story.userId}
        />
      </div>
    </Layout>
  );
};

export default Story;
