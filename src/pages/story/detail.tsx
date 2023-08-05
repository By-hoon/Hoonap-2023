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
import deleteFile from "@/firebase/storage/deleteFile";
import updateField from "@/firebase/firestore/updateField";

interface storyProps {
  title: string;
  story: string;
  images: string[];
  userId: string;
}

const StoryDetail = () => {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [userId, setUserId] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [nickname, setNickname] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

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

    setStoryData(result);
  };

  const setStoryData = (result: storyProps | DocumentData) => {
    setTitle(result.title);
    setStory(result.story);
    setImages(result.images);
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

  const deleteStory = async () => {
    await deleteDocument("stories", storyId as string);
    await deleteDocument("paths", storyId as string);
    await deleteDocument("images", storyId as string);

    for (let i = 0; i < images.length; i++) {
      await deleteFile(images[i]);
    }

    updateUserStoryIds();

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
                  <div className="absolute bottom-0 right-0 w-full md:w-[300px] h-[80%] text-white font-semibold text-[20px] bg-zinc-800 rounded-[6px] p-[15px] z-20">
                    {userId === currentUserId ? (
                      <div>
                        <div className="cursor-pointer flex items-center text-red-600" onClick={deleteStory}>
                          <Icon className="text-[24px] mr-[5px]" icon="mingcute:delete-line" />
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
