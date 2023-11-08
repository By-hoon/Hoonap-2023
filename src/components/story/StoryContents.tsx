import Link from "next/link";

interface StoryContentsProps {
  title: string;
  story: string;
  storyId: string;
  hasLink?: boolean;
}

const StoryContents = ({ title, story, storyId, hasLink = false }: StoryContentsProps) => {
  return (
    <div>
      <div>
        <div className="text-[22px]">{title}</div>
        <div className="text-[18px] mt-[5px]">{story}</div>
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
