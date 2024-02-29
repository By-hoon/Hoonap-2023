import { StoryProps } from "@/pages/story/detail";
import StoryImages from "./StoryImages";
import StoryContents from "./StoryContents";
import StoryHeader from "./StoryHeader";
import { Dispatch, SetStateAction } from "react";

interface PreviewProps {
  story: StoryProps;
  regular: { [key: string]: boolean };
  setRegular: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
}

const Preview = ({ story, regular, setRegular }: PreviewProps) => {
  return (
    <div className="w-[468px] mobile:w-[300px] border-b-2 mx-auto pb-[15px]">
      <StoryHeader story={story} regular={regular} setRegular={setRegular} style="h-[50px]" />
      <StoryImages images={story.images} size="w-full h-[468px] mobile:h-[300px]" />
      <StoryContents
        title={story.title}
        story={story.story}
        createdAt={story.createdAt}
        storyId={story.storyId}
        userId={story.userId}
        hasLink
      />
    </div>
  );
};

export default Preview;
