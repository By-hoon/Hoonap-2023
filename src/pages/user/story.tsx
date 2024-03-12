import Layout from "@/components/common/Layout";
import DetailView from "@/components/story/DetailView";
import { StoryProps } from "../story/detail";
import Router, { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import BasicImage from "@/components/common/BasicImage";
import withHead from "@/components/hoc/withHead";
import { ALERT_TITLE, ALERT_CONTENT, HEAD_TITLE, HEAD_DESCRIPTION } from "@/shared/constants";
import useRegular from "@/hooks/useRegular";
import { useAuth } from "@/context/authProvider";
import { PopUpContext } from "@/context/popUpProvider";
import { cardSizeCalculator } from "@/utils/util";

const Story = () => {
  const [current, setCurrent] = useState<StoryProps>();
  const [rest, setRest] = useState<StoryProps[]>([]);
  const [cardSize, setCardSize] = useState(0);

  const sizeRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { user } = useAuth();
  const { regular, setRegular } = useRegular(user?.uid);

  const { alert } = useContext(PopUpContext);

  const { storyId, stories } = router.query;

  useEffect(() => {
    if (!storyId) {
      alert(ALERT_TITLE.ACCESS, ALERT_CONTENT.NO_USER);
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
          createdAt: story.createdAt,
          storyId: storyId,
          userId: story.userId,
        });
        return;
      }
      restStories.push(story);
    });
    setRest(restStories);
  }, [alert, stories, storyId]);

  useEffect(() => {
    if (!current) return;

    const handleResize = () => {
      if (!sizeRef.current) return;
      const curWidth = sizeRef.current?.offsetWidth - 1;

      const curSize = cardSizeCalculator(curWidth);

      setCardSize(curSize);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [current]);

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
        <DetailView story={current} regular={regular} setRegular={setRegular} />
      </div>
      <div ref={sizeRef} className="flex flex-wrap mt-[20px]">
        {rest.map((restStory) => (
          <div
            key={restStory.storyId}
            className="cursor-pointer mx-[5px] mb-[10px]"
            style={{
              width: `${cardSize}px`,
              height: `${cardSize}px`,
            }}
            onClick={() => {
              router.push(
                {
                  pathname: "/user/story",
                  query: { storyId: restStory.storyId, stories },
                },
                "/story/detail"
              );
            }}
          >
            <BasicImage
              style={"relative w-full h-full rounded-[10px] bg-black overflow-hidden"}
              url={restStory.images[0]}
              alt={"rest-story-image"}
            />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default withHead(Story, HEAD_TITLE.USER_STORY, HEAD_DESCRIPTION.USER_STORY);
