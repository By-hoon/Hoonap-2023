import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import useClickOutside from "@/hooks/useClickOutside";
import { useAuth } from "@/context/authProvider";
import BasicImage from "@/components/common/BasicImage";
import { StoryProps } from "@/pages/story/detail";
import useUser from "@/hooks/useUser";

interface PreviewProps extends StoryProps {
  deleteStory: (storyId: string, userId: string) => void;
}

const Preview = ({ title, story, images, paths, storyId, userId, deleteStory }: PreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { user } = useAuth();
  const { nickname } = useUser(userId);

  const { show: showMoreMenu, ref: moreMenuRef, onClickTarget: onClickMoreMenu } = useClickOutside();

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
    <div className="w-[468px] mobile:w-[300px] border-b-2 mx-auto pb-[15px]">
      <div className="flex justify-between h-[50px]">
        <div className="h-full flex items-center text-[18px]">
          <Link
            href={{
              pathname: "/user/detail",
              query: { userId: userId },
            }}
            as="/user/detail"
          >
            {nickname}
          </Link>
        </div>
        <div className="flex items-center" ref={moreMenuRef}>
          <Icon icon="ri:more-fill" className=" cursor-pointer text-[32px]" onClick={onClickMoreMenu} />
          {showMoreMenu ? (
            <div>
              <div className="background-shadow !fixed" onClick={onClickMoreMenu} />
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] mobile:w-[250px] font-semibold text-[18px] bg-white rounded-[6px] z-30">
                {userId === user?.uid ? (
                  <div>
                    <Link
                      className="cursor-pointer flex justify-center items-center m-[5px] p-[5px]"
                      href={{
                        pathname: "/story/edit",
                        query: {
                          title,
                          story,
                          images,
                          paths: JSON.stringify(paths),
                          userId,
                          storyId,
                          restExpStory: JSON.stringify({}),
                        },
                      }}
                      as="/story/edit"
                    >
                      수정
                    </Link>
                    <div
                      className="cursor-pointer flex justify-center items-center text-red-600 m-[5px] p-[5px]"
                      onClick={() => deleteStory(storyId, userId)}
                    >
                      삭제
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {images.length !== 0 ? (
        <BasicImage
          style={"relative w-full h-[468px] mobile:h-[300px] bg-black rounded-[5px]"}
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
      ) : null}
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
    </div>
  );
};

export default Preview;
