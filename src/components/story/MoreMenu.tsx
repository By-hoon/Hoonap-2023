import { useAuth } from "@/context/authProvider";
import MenuButton from "./MenuButton";
import useClickOutside from "@/hooks/useClickOutside";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import { StoryProps } from "@/pages/story/detail";
import dynamic from "next/dynamic";
import MapOption from "../MapOption";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

interface MoreMenuProps extends StoryProps {
  deleteStory: (storyId: string, userId: string) => void;
}

const MoreMenu = ({ title, story, images, paths, storyId, userId, deleteStory }: MoreMenuProps) => {
  const { user } = useAuth();

  const router = useRouter();

  const { show: showMoreMenu, ref: moreMenuRef, onClickTarget: onClickMoreMenu } = useClickOutside();
  const { show: showMap, ref: mapRef, onClickTarget: onClickMap } = useClickOutside();

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
              onClick={() => deleteStory(storyId, userId)}
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
