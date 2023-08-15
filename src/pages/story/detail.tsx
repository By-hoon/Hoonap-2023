import { useEffect, useState } from "react";
import Image from "next/image";
import getDocument from "@/firebase/firestore/getDocument";
import Link from "next/link";
import Layout from "@/components/common/Layout";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { DocumentData } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { isExp } from "@/utils/util";
import useClickOutside from "@/hooks/useClickOutside";
import deleteDocument from "@/firebase/firestore/deleteDocument";
import updateField from "@/firebase/firestore/updateField";
import { deleteFile } from "@/firebase/storage/delete";

export interface storyProps {
  title: string;
  story: string;
  paths: { latitude: number; longitude: number }[];
  images: string[];
  storyId: string;
  userId: string;
}

const StoryDetail = () => {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [paths, setPaths] = useState<{ latitude: number; longitude: number }[]>([]);
  const [userId, setUserId] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [nickname, setNickname] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const [restExpStory, setRestExpStory] = useState<{ [key: string]: storyProps }>({});

  const { show: showMoreMenu, ref: moreMenuRef, onClickTarget: onClickMoreMenu } = useClickOutside();

  const router = useRouter();
  const { storyId } = router.query;
  const getStory = async () => {
    const result = await getDocument("stories", storyId as string);

    if (!result) return;

    setStoryData(result);
  };

  const getExpStory = () => {
    const storageStory = window.localStorage.getItem("story");
    if (!storageStory) return;

    const expStory = JSON.parse(storageStory);
    const result: storyProps = expStory[storyId as string];

    const { ...newExpStory } = expStory;
    delete newExpStory[storyId as string];

    setStoryData(result);
    setRestExpStory(newExpStory);
  };

  const setStoryData = (result: storyProps | DocumentData) => {
    setTitle(result.title);
    setStory(result.story);
    setImages(result.images);
    setPaths(result.paths);
    setUserId(result.userId);

    getUserNickname(result.userId);
  };

  const getUserNickname = async (userId: string) => {
    const result = await getDocument("users", userId);
    if (!result) {
      setNickname("unknown");
      return;
    }
    setNickname(result.nickname);
  };

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
    for (let i = 0; i < images.length; i++) {
      await deleteFile(images[i]);
    }

    if (isExp(currentUserId)) {
      deleteExpStory();
    } else {
      await deleteDocument("stories", storyId as string);
      await deleteDocument("paths", storyId as string);
      await deleteDocument("images", storyId as string);

      updateUserStoryIds();
    }

    alert("스토리가 삭제되었습니다.");
    router.push("/story/list");
  };

  const updateUserStoryIds = async () => {
    const userData = await getDocument("users", userId);
    if (!userData) return;

    const storyIds = userData.storyIds;

    const newStoryIds = storyIds.length == 1 ? null : storyIds.filter((e: string) => e != storyId);

    await updateField("users", userId, "storyIds", newStoryIds);
  };

  useEffect(() => {
    if (currentUserId === "") return;

    if (isExp(currentUserId)) {
      getExpStory();
      return;
    }
    getStory();
  }, [currentUserId]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setCurrentUserId(user.uid);
    });
  }, []);

  return (
    <Layout>
      <div className="relative md:grid md:grid-cols-[1fr_300px] min-w-[300px] max-w-[964px] md:mt-[95px] md:mx-[30px] lg:mx-auto border rounded-[5px] overflow-hidden">
        <div className="main-relative">
          <figure className="main-absolute p-0 bg-black">
            {images.length !== 0 ? (
              <Image
                src={images[currentIndex]}
                alt="detail-image"
                className="!relative object-contain"
                sizes="(max-width: 768px) 50vw, 100vw"
                fill
              />
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
          </figure>
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
                  <div className="absolute bottom-0 right-0 w-full md:w-[300px] h-[80%] text-white font-semibold text-[18px] bg-zinc-800 rounded-[6px] p-[20px] z-20">
                    {userId === currentUserId ? (
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
        </div>
      </div>
    </Layout>
  );
};

export default StoryDetail;
