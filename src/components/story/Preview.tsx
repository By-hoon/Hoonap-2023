import { StoryProps } from "@/pages/story/detail";
import StoryImages from "./StoryImages";
import StoryContents from "./StoryContents";
import StoryHeader from "./StoryHeader";

const Preview = ({ story, regular }: { story: StoryProps; regular: { [key: string]: boolean } }) => {
  return (
    <div className="w-[468px] mobile:w-[300px] border-b-2 mx-auto pb-[15px]">
      <StoryHeader story={story} regular={regular} style="h-[50px]" />
      <StoryImages images={story.images} size="w-full h-[468px] mobile:h-[300px]" />
      <StoryContents
        title={story.title}
        story={story.story}
        storyId={story.storyId}
        userId={story.userId}
        hasLink
      />
    </div>
  );
};

export default Preview;
