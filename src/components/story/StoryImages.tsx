import { SetStateAction, useEffect, useState } from "react";
import BasicImage from "../common/BasicImage";
import { Icon } from "@iconify/react";
import { useAuth } from "@/context/authProvider";
import Like from "../common/Like";
import { getImageId } from "@/utils/util";
import getDocument from "@/firebase/firestore/getDocument";

interface StoryImagesProps {
  images: { url: string; storyId: string }[];
  size: string;
  style?: string;
}

const StoryImages = ({ images, size, style = "" }: StoryImagesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState<{ [key: string]: boolean }>({});
  const [imageId, setImageId] = useState("");

  const { user } = useAuth();

  const preImage = () => {
    if (currentIndex === 0) {
      setCurrentIndex(images.length - 1);
      return;
    }
    setCurrentIndex((c) => c - 1);
  };
  const nextImage = () => {
    if (currentIndex === images.length - 1) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((c) => c + 1);
  };

  useEffect(() => {
    if (!user) return;

    const getLikeData = async () => {
      const result = await getDocument("likes", user.uid);
      if (!result || result.empty) return;

      const newLikes: { [key: string]: boolean } = {};
      Object.keys(result).forEach((imageId) => {
        newLikes[imageId] = true;
      });

      setLikes(newLikes);
    };

    getLikeData();
  }, [user]);

  useEffect(() => {
    const curImageId = getImageId(images[currentIndex].url);

    setImageId(curImageId);
  }, [currentIndex]);

  return (
    <BasicImage
      style={`relative ${size} bg-black rounded-[5px] ${style}`}
      url={images[currentIndex].url}
      alt={"detail-image"}
    >
      {images.length > 1 ? (
        <div>
          <div className="flex justify-between w-full absolute top-[50%] left-[0] translate-y-[-50%] text-[28px] text-white opacity-60 px-[10px]">
            <figcaption className="cursor-pointer" onClick={preImage}>
              <Icon icon="icon-park-solid:left-c" />
            </figcaption>
            <figcaption className="cursor-pointer" onClick={nextImage}>
              <Icon icon="icon-park-solid:right-c" />
            </figcaption>
          </div>
          <div className="absolute bottom-[10px] left-0 w-full z-20 flex justify-center">
            {images.map((image, index) => (
              <div
                key={image.url}
                className={`w-[8px] h-[8px] bg-white rounded-[50%] mx-[2px]
                ${currentIndex === index ? "opacity-100" : "opacity-40"}`}
              />
            ))}
          </div>
        </div>
      ) : null}
      {user ? (
        <div className="absolute bottom-0 left-0 mobile:left-[10px] h-[60px] mobile:h-[40px] flex items-center w-full bg-black bg-opacity-30 pl-[5px] z-20">
          <Like
            image={{ url: images[currentIndex].url, imageId, storyId: images[currentIndex].storyId }}
            userId={user.uid}
            likes={likes}
            setLikes={setLikes}
          />
        </div>
      ) : null}
    </BasicImage>
  );
};

export default StoryImages;
