import Link from "next/link";
import Comments from "./comment/Comments";

interface StoryContentsProps {
  title: string;
  story: string;
  storyId: string;
  userId: string;
  hasLink?: boolean;
}

const StoryContents = ({ title, story, storyId, userId, hasLink = false }: StoryContentsProps) => {
  return (
    <div>
      <div>
        <div className="text-[20px] break-all">{title}</div>
        <div className="text-[16px] break-all">{story}</div>
      </div>
      <div>
        <Comments storyId={storyId} userId={userId} />
      </div>
      {hasLink ? (
        <div className="text-[18px] text-bc text-center">
          <Link
            href={{
              pathname: "/story/detail",
              query: { storyId },
            }}
            as="/story/detail"
          >
            스토리 보러가기
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default StoryContents;
