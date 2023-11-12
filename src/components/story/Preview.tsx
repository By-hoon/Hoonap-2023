import Link from "next/link";
import { StoryProps } from "@/pages/story/detail";
import useUser from "@/hooks/useUser";
import StoryImages from "./StoryImages";
import StoryContents from "./StoryContents";
import MoreMenu from "./MoreMenu";

const Preview = ({ title, story, images, paths, storyId, userId }: StoryProps) => {
  const { nickname } = useUser(userId);

  return (
    <div className="w-[468px] mobile:w-[300px] border-b-2 mx-auto pb-[15px]">
      <div className="flex justify-between h-[50px]">
        <div className="h-full flex items-center text-[18px]">
          <Link
            href={{
              pathname: "/user/detail",
              query: { userId: userId },
            }}
            as="/user/detail"
          >
            {nickname}
          </Link>
        </div>
        <MoreMenu
          title={title}
          story={story}
          paths={paths}
          images={images}
          storyId={storyId}
          userId={userId}
        />
      </div>
      <StoryImages images={images} size="w-full h-[468px] mobile:h-[300px]" />
      <StoryContents title={title} story={story} storyId={storyId} hasLink />
    </div>
  );
};

export default Preview;
