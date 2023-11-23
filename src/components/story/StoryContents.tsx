import Link from "next/link";
import CommentInput from "./comment/CommentInput";

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
        <div className="text-[20px]">{title}</div>
        <div className="text-[16px]">{story}</div>
      </div>
      <div className="mt-[5px]">
        <CommentInput storyId={storyId} />
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
