import useUser from "@/hooks/useUser";
import { StoryProps } from "@/pages/story/detail";
import Link from "next/link";
import MoreMenu from "./MoreMenu";
import StoryImages from "./StoryImages";
import StoryContents from "./StoryContents";

const DetailView = ({ title, story, images, paths, storyId, userId }: StoryProps) => {
  const { nickname } = useUser(userId);

  return (
    <div className="relative md:grid md:grid-cols-[1fr_300px] min-w-[300px] max-w-[964px] md:mt-[95px] md:mx-[30px] lg:mx-auto border rounded-[5px] overflow-hidden">
      <div className="main-relative">
        <figure className="main-absolute p-0 bg-black">
          <StoryImages images={images} size="w-full h-full" />
        </figure>
      </div>
      <div className="px-[15px]">
        <div className="flex justify-between h-[60px] border-b-2 mb-[10px]">
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
        <StoryContents title={title} story={story} storyId={storyId} userId={userId} />
      </div>
    </div>
  );
};

export default DetailView;
