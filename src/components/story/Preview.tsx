import getDocument from "@/firebase/firestore/getDocument";
import { useEffect } from "react";

interface PreviewProps {
  currentStoryId: string;
}

const Preview = ({ currentStoryId }: PreviewProps) => {
  const getStory = async () => {
    const result = await getDocument("stories", currentStoryId);
    console.log(result);
  };

  useEffect(() => {
    getStory();
  });
  return <div>스토리 미리보기</div>;
};

export default Preview;
