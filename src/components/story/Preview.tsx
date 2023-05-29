import getDocument from "@/firebase/firestore/getDocument";
import { useEffect, useState } from "react";
import Image from "next/image";

interface PreviewProps {
  currentStoryId: string;
}

const Preview = ({ currentStoryId }: PreviewProps) => {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const getStory = async () => {
    const result = await getDocument("stories", currentStoryId);
    if (!result) return;
    setImages(result.images);
    setTitle(result.title);
    setStory(result.story);
  };
  useEffect(() => {
    getStory();
  }, [currentStoryId]);
  return (
    <div>
      <div>
        <div>{title}</div>
        <div>{story}</div>
      </div>
      <div>
        {images.map((imageUrl, index) => (
          <figure key={index}>
            <Image
              src={imageUrl}
              alt="preview-image"
              width={150}
              height={150}
              style={{ width: 150, height: 150 }}
            />
          </figure>
        ))}
      </div>
    </div>
  );
};

export default Preview;
