import Link from "next/link";

interface StoryContentsProps {
  title: string;
  story: string;
  storyId: string;
}

const StoryContents = ({ title, story, storyId }: StoryContentsProps) => {
  return (
    <div>
      <div className="flex mt-[5px]">
        <div className="text-[18px] font-semibold mr-[10px]">{title}</div>
        <div className="text-[16px] mt-[5px]">{story}</div>
      </div>
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
    </div>
  );
};

export default StoryContents;
