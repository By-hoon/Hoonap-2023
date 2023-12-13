import { useAuth } from "@/context/authProvider";
import MenuButton from "./MenuButton";
import useClickOutside from "@/hooks/useClickOutside";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import { StoryProps } from "@/pages/story/detail";
import dynamic from "next/dynamic";
import MapOption from "../MapOption";
import { useContext } from "react";
import { PopUpContext } from "@/context/popUpProvider";
import deleteDocument from "@/firebase/firestore/deleteDocument";
import getDocument from "@/firebase/firestore/getDocument";
import updateField from "@/firebase/firestore/updateField";
import { deleteFile } from "@/firebase/storage/delete";
import { isExp } from "@/utils/util";
import { confirmContent, confirmTitle } from "@/shared/constants";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

const MoreMenu = ({ title, story, images, paths, storyId, userId }: StoryProps) => {
  const { user } = useAuth();

  const router = useRouter();

  const { confirm } = useContext(PopUpContext);

  const { show: showMoreMenu, ref: moreMenuRef, onClickTarget: onClickMoreMenu } = useClickOutside();
  const { show: showMap, ref: mapRef, onClickTarget: onClickMap } = useClickOutside();

  const deleteExpStory = (storyId: string) => {
    const storageStories = window.localStorage.getItem("story");
    const storagePaths = window.localStorage.getItem("path");
    const storageImages = window.localStorage.getItem("image");

    if (!storageStories || !storagePaths || !storageImages) {
      alert("게시된 스토리가 없습니다.");
      router.push("/");
      return;
    }

    const expStories: { [key: string]: StoryProps } = JSON.parse(storageStories);
    const expPaths: { [key: string]: { paths: { latitude: number; longitude: number }[]; storyId: string } } =
      JSON.parse(storagePaths);
    const expImages: { [key: string]: { images: string[]; storyId: string } } = JSON.parse(storageImages);

    if (Object.keys(expStories).length === 1) {
      window.localStorage.clear();
      return;
    }

    delete expStories[storyId];
    delete expPaths[storyId];
    delete expImages[storyId];

    window.localStorage.setItem("story", JSON.stringify(expStories));
    window.localStorage.setItem("path", JSON.stringify(expPaths));
    window.localStorage.setItem("image", JSON.stringify(expImages));
  };

  const deleteStory = async () => {
    const result = await confirm(confirmTitle.deleteStory, confirmContent.deleteStory);
    if (!result) return;

    for (let i = 0; i < images.length; i++) {
      await deleteFile(images[i]);
    }

    if (isExp(user?.uid as string)) {
      deleteExpStory(storyId);
      router.push("/");
      return;
    }

    await deleteDocument("stories", storyId);
    await deleteDocument("paths", storyId);
    await deleteDocument("images", storyId);

    updateUserStoryIds(storyId, userId);

    router.push("/");
  };

  const updateUserStoryIds = async (storyId: string, userId: string) => {
    const userData = await getDocument("users", userId);
    if (!userData) return;

    const storyIds = userData.storyIds;

    const newStoryIds = storyIds.length == 1 ? null : storyIds.filter((e: string) => e != storyId);

    await updateField("users", userId, "storyIds", newStoryIds);
  };

  return (
    <div className="flex items-center" ref={moreMenuRef}>
      <Icon icon="ri:more-fill" className=" cursor-pointer text-[32px]" onClick={onClickMoreMenu} />
      {showMoreMenu ? (
        <div ref={mapRef}>
          <div className="background-shadow !fixed" onClick={onClickMoreMenu} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] mobile:w-[250px] font-semibold text-[18px] bg-white rounded-[6px] z-30">
            <MenuButton name={"위치 보기"} onClick={onClickMap} />
            <MenuButton
              isShow={userId === user?.uid}
              name={"수정"}
              onClick={() => {
                router.push(
                  {
                    pathname: "/story/edit",
                    query: {
                      title,
                      story,
                      images,
                      paths: JSON.stringify(paths),
                      userId,
                      storyId,
                    },
                  },
                  "/story/edit"
                );
              }}
            />
            <MenuButton
              isShow={userId === user?.uid}
              name={"삭제"}
              style="text-red-600"
              onClick={deleteStory}
            />
          </div>
          {showMap ? (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[768px] h-[768px] mobile:w-[300px] mobile:h-[300px] z-40">
              <Map
                location={{
                  latitude: paths[0].latitude,
                  longitude: paths[0].longitude,
                }}
              >
                <MapOption paths={[{ pathArray: paths, storyId }]} />
              </Map>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default MoreMenu;
