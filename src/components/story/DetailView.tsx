import { StoryProps } from "@/pages/story/detail";
import StoryImages from "./StoryImages";
import StoryContents from "./StoryContents";
import StoryHeader from "./StoryHeader";

const DetailView = ({ story }: { story: StoryProps }) => {
  return (
    <div className="relative md:grid md:grid-cols-[1fr_300px] min-w-[300px] max-w-[964px] md:mt-[30px] md:mx-[30px] lg:mx-auto border rounded-[5px] overflow-hidden">
      <div className="main-relative">
        <figure className="main-absolute p-0 bg-black">
          <StoryImages images={story.images} size="w-full h-full" />
        </figure>
      </div>
      <div className="px-[15px] md:grid md:grid-rows-[60px_1fr]">
        <StoryHeader story={story} style="h-[50px] border-b mb-[10px]" />
        <StoryContents
          title={story.title}
          story={story.story}
          storyId={story.storyId}
          userId={story.userId}
        />
      </div>
    </div>
  );
};

export default DetailView;
