import useUser from "@/hooks/useUser";
import { StoryProps } from "@/pages/story/detail";
import Link from "next/link";
import MoreMenu from "./MoreMenu";
import { useAuth } from "@/context/authProvider";

interface StoryHeaderProps {
  story: StoryProps;
  style: string;
}

const StoryHeader = ({ story, style }: StoryHeaderProps) => {
  const { nickname } = useUser(story.userId);
  const { user } = useAuth();

  return (
    <div className={`flex justify-between ${style}`}>
      <div className="h-full flex flex-wrap items-center">
        <Link
          className="text-[18px]"
          href={{
            pathname: "/user/detail",
            query: { userId: story.userId },
          }}
          as="/user/detail"
        >
          {nickname}
        </Link>
        {user?.uid !== story.userId ? (
          <div
            className="cursor-pointer text-[14px] text-bc ml-[5px]"
            onClick={() => {
              console.log(user?.uid);
              console.log(story.userId);
            }}
          >
            단골하기
          </div>
        ) : null}
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
