import useUser from "@/hooks/useUser";
import { StoryProps } from "@/pages/story/detail";
import Link from "next/link";
import MoreMenu from "./MoreMenu";

interface StoryHeaderProps {
  story: StoryProps;
  style: string;
}

const StoryHeader = ({ story, style }: StoryHeaderProps) => {
  const { nickname } = useUser(story.userId);

  return (
    <div className={`flex justify-between ${style}`}>
      <div className="h-full flex items-center text-[18px]">
        <Link
          href={{
            pathname: "/user/detail",
            query: { userId: story.userId },
          }}
          as="/user/detail"
        >
          {nickname}
        </Link>
      </div>
      <MoreMenu
        title={story.title}
        story={story.story}
        paths={story.paths}
        images={story.images}
        createdAt={story.createdAt}
        storyId={story.storyId}
        userId={story.userId}
      />
    </div>
  );
};

export default StoryHeader;
