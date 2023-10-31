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
    <div className="relative md:grid md:grid-cols-[1fr_300px] min-w-[300px] max-w-[964px] md:mt-[95px] md:mx-[30px] lg:mx-auto border rounded-[5px] overflow-hidden">
      <div className="main-relative">
        {images.length !== 0 ? (
          <BasicImage style={"w-full h-full relative"} url={images[currentIndex]} alt={"detail-image"} />
        ) : null}
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
      </div>
      <div>
        <div className="flex justify-between h-[60px] border-b-2 mb-[10px] px-[15px]">
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
                <div className="background-shadow" onClick={onClickMoreMenu} />
                <div className="absolute bottom-0 right-0 mobile:top-0 w-[250px] md:w-[300px] h-[80%] mobile:max-h-[380px] text-white font-semibold text-[18px] bg-zinc-800 rounded-[6px] p-[20px] z-20">
                  {userId === user?.uid ? (
                    <div>
                      <Link
                        className="cursor-pointer flex items-center text-white mb-[20px]"
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
                        <Icon className="text-[28px] mr-[8px]" icon="fluent:edit-20-regular" />
                        수정
                      </Link>
                      <div
                        className="cursor-pointer flex items-center text-red-600 mb-[20px]"
                        onClick={() => deleteStory(storyId, userId)}
                      >
                        <Icon className="text-[28px] mr-[8px]" icon="mingcute:delete-line" />
                        삭제
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="px-[15px]">
          <div className="h-[40px] text-[22px]">{title}</div>
          <div className="text-[18px] mt-[5px]">{story}</div>
        </div>
        <div className="text-[18px] text-bc font-semibold">
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
