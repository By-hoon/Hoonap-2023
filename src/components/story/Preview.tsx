import { useContext, useEffect, useState } from "react";
import getDocument from "@/firebase/firestore/getDocument";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { DocumentData } from "firebase/firestore";
import { isExp } from "@/utils/util";
import useClickOutside from "@/hooks/useClickOutside";
import deleteDocument from "@/firebase/firestore/deleteDocument";
import updateField from "@/firebase/firestore/updateField";
import { deleteFile } from "@/firebase/storage/delete";
import { useAuth } from "@/context/authProvider";
import BasicImage from "@/components/common/BasicImage";
import { PopUpContext } from "@/context/popUpProvider";
import { storyProps } from "@/pages/story/detail";
import useUser from "@/hooks/useUser";

interface PreviewProps {
  currentStoryId: string;
  userId: string;
}

const Preview = ({ currentStoryId, userId }: PreviewProps) => {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [paths, setPaths] = useState<{ latitude: number; longitude: number }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [restExpStory, setRestExpStory] = useState<{ [key: string]: storyProps }>({});

  const { nickname } = useUser(userId);

  const { show: showMoreMenu, ref: moreMenuRef, onClickTarget: onClickMoreMenu } = useClickOutside();

  const { user } = useAuth();
  const router = useRouter();
  const { confirm } = useContext(PopUpContext);

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

  const deleteExpStory = () => {
    const restExpStories = Object.keys(restExpStory);

    if (restExpStories.length === 0) {
      window.localStorage.clear();
      return;
    }

    const newExpPaths: {
      [key: string]: { paths: { latitude: number; longitude: number }[]; storyId: string };
    } = {};
    const newExpImages: { [key: string]: { images: string[]; storyId: string } } = {};

    restExpStories.forEach((key) => {
      newExpPaths[key] = {
        paths: restExpStory[key].paths,
        storyId: restExpStory[key].storyId,
      };
      newExpImages[key] = {
        images: restExpStory[key].images,
        storyId: restExpStory[key].storyId,
      };
    });

    window.localStorage.setItem("story", JSON.stringify(restExpStory));
    window.localStorage.setItem("path", JSON.stringify(newExpPaths));
    window.localStorage.setItem("image", JSON.stringify(newExpImages));
  };

  const deleteStory = async () => {
    const result = await confirm("스토리를 삭제하시겠습니까?", "삭제된 스토리는 다시 복구할 수 없습니다.");
    if (!result) return;

    for (let i = 0; i < images.length; i++) {
      await deleteFile(images[i]);
    }

    if (isExp(user?.uid as string)) {
      deleteExpStory();
    } else {
      await deleteDocument("stories", currentStoryId);
      await deleteDocument("paths", currentStoryId);
      await deleteDocument("images", currentStoryId);

      updateUserStoryIds();
    }

    router.push("/story/list");
  };

  const updateUserStoryIds = async () => {
    const userData = await getDocument("users", userId);
    if (!userData) return;

    const storyIds = userData.storyIds;

    const newStoryIds = storyIds.length == 1 ? null : storyIds.filter((e: string) => e != currentStoryId);

    await updateField("users", userId, "storyIds", newStoryIds);
  };

  useEffect(() => {
    if (!user) return;

    const setStoryData = (result: storyProps | DocumentData) => {
      setTitle(result.title);
      setStory(result.story);
      setImages(result.images);
      setPaths(result.paths);
    };

    const getStory = async () => {
      const result = await getDocument("stories", currentStoryId);

      if (!result) return;

      setStoryData(result);
    };

    const getExpStory = () => {
      const storageStory = window.localStorage.getItem("story");
      if (!storageStory) return;

      const expStory = JSON.parse(storageStory);
      const result: storyProps = expStory[currentStoryId];

      const { ...newExpStory } = expStory;
      delete newExpStory[currentStoryId];

      setStoryData(result);
      setRestExpStory(newExpStory);
    };

    if (isExp(user.uid)) {
      getExpStory();
      return;
    }
    getStory();
  }, [currentStoryId, user]);

  if (!user) return <div></div>;

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
                  {userId === user.uid ? (
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
                            currentStoryId,
                            restExpStory: JSON.stringify(restExpStory),
                          },
                        }}
                        as="/story/edit"
                      >
                        <Icon className="text-[28px] mr-[8px]" icon="fluent:edit-20-regular" />
                        수정
                      </Link>
                      <div
                        className="cursor-pointer flex items-center text-red-600 mb-[20px]"
                        onClick={deleteStory}
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
              query: { storyId: currentStoryId },
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
