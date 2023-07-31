import getDocument from "@/firebase/firestore/getDocument";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import { isExp } from "@/utils/util";

interface PreviewProps {
  currentStoryId: string;
  userId: string;
}

const Preview = ({ currentStoryId, userId }: PreviewProps) => {
  const [images, setImages] = useState<string[]>([]);
  const { nickname } = useUser(userId);

  const getStory = async () => {
    const result = await getDocument("stories", currentStoryId);
    if (!result) return;
    setImages(result.images);
  };

  const getExpImageData = () => {
    const storageImage = window.localStorage.getItem("image");
    if (!storageImage) return;

    const expImage = JSON.parse(storageImage);
    setImages(expImage[currentStoryId].images);

    return;
  };

  useEffect(() => {
    if (isExp(userId)) {
      getExpImageData();
      return;
    }
    getStory();
  }, [currentStoryId]);

  return (
    <div className="w-[100%] rounded-[7px] shadow-underblue overflow-hidden">
      <div className="h-[50px] flex items-end text-[18px]">
        <Link
          className="ml-[20px]"
          href={{
            pathname: "/user/detail",
            query: { userId: userId },
          }}
          as="/user/detail"
        >
          {nickname}
        </Link>
      </div>
      <div className="h-[290px] flex flex-wrap overflow-y-scroll scrollbar-hide p-[5px]">
        {images.map((imageUrl, index) => (
          <figure
            className="relative w-[100px] h-[100px] rounded-[5px] border-2 mx-[5px] my-[10px] p-[5px]"
            key={index}
          >
            <Image
              src={imageUrl}
              alt="preview-image"
              className="!relative object-contain"
              sizes="(max-width: 768px) 50vw, 100vw"
              fill
            />
          </figure>
        ))}
      </div>
      <div className="h-[50px] flex justify-center items-center text-white font-semibold bg-bc">
        <Link
          href={{
            pathname: "/story/detail",
            query: { storyId: currentStoryId },
          }}
          as="/story/detail"
        >
          스토리 보러가기
        </Link>
      </div>
    </div>
  );
};

export default Preview;
