import Layout from "@/components/common/Layout";
import DetailView from "@/components/story/DetailView";
import { StoryProps } from "../story/detail";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Story = () => {
  const [current, setCurrent] = useState<StoryProps>();
  const [rest, setRest] = useState<StoryProps[]>([]);

  const router = useRouter();

  const { storyId, stories } = router.query;

  useEffect(() => {
    if (!storyId) {
      alert("스토리 정보가 없습니다.");
      Router.push("/story/list");
      return;
    }

    const restStories: StoryProps[] = [];
    JSON.parse(stories as string).forEach((story: StoryProps) => {
      if (story.storyId === storyId) {
        setCurrent({
          title: story.title,
          story: story.story,
          paths: story.paths,
          images: story.images,
          storyId: storyId,
          userId: story.userId,
        });
        return;
      }
      restStories.push(story);
    });
    setRest(restStories);
  }, [storyId]);

  if (!current) {
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
          title={current.title}
          story={current.story}
          paths={current.paths}
          images={current.images}
          storyId={current.storyId}
          userId={current.userId}
        />
      </div>
    </Layout>
  );
};

export default Story;
