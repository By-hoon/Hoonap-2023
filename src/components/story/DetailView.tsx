import { StoryProps } from "@/pages/story/detail";
import StoryImages from "./StoryImages";
import StoryContents from "./StoryContents";
import StoryHeader from "./StoryHeader";
import { Dispatch, SetStateAction } from "react";

interface DetailViewProps {
  story: StoryProps;
  regular: { [key: string]: boolean };
  setRegular: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
}

const DetailView = ({ story, regular, setRegular }: DetailViewProps) => {
  return (
    <div className="relative md:grid md:grid-cols-[1fr_300px] min-w-[300px] max-w-[964px] md:mt-[30px] md:mx-[30px] lg:mx-auto border rounded-[5px] overflow-hidden">
      <div className="main-relative">
        <figure className="main-absolute p-0 bg-black">
          <StoryImages images={story.images} size="w-full h-full" />
        </figure>
      </div>
      <div className="px-[15px] md:grid md:grid-rows-[60px_1fr]">
        <StoryHeader
          story={story}
          regular={regular}
          setRegular={setRegular}
          style="h-[50px] border-b mb-[10px]"
        />
        <StoryContents
          title={story.title}
          story={story.story}
          createdAt={story.createdAt}
          storyId={story.storyId}
          userId={story.userId}
        />
      </div>
    </div>
  );
};

export default DetailView;
