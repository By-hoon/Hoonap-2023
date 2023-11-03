import { useState } from "react";
import BasicImage from "../common/BasicImage";
import { Icon } from "@iconify/react";

interface StoryImagesProps {
  images: string[];
  size: string;
  style?: string;
}

const StoryImages = ({ images, size, style = "" }: StoryImagesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <BasicImage
      style={`relative ${size} bg-black rounded-[5px] ${style}`}
      url={images[currentIndex]}
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
                key={image}
                className={`w-[8px] h-[8px] bg-white rounded-[50%] mx-[2px]
                ${currentIndex === index ? "opacity-100" : "opacity-40"}`}
              />
            ))}
          </div>
        </div>
      ) : null}
    </BasicImage>
  );
};

export default StoryImages;
