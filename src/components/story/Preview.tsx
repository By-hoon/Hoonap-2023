import Link from "next/link";
import { Icon } from "@iconify/react";
import useClickOutside from "@/hooks/useClickOutside";
import { useAuth } from "@/context/authProvider";
import { StoryProps } from "@/pages/story/detail";
import useUser from "@/hooks/useUser";
import MenuButton from "./MenuButton";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import MapOption from "../MapOption";
import StoryImages from "./StoryImages";
import StoryContents from "./StoryContents";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

interface PreviewProps extends StoryProps {
  deleteStory: (storyId: string, userId: string) => void;
}

const Preview = ({ title, story, images, paths, storyId, userId, deleteStory }: PreviewProps) => {
  const { user } = useAuth();
  const { nickname } = useUser(userId);

  const router = useRouter();

  const { show: showMoreMenu, ref: moreMenuRef, onClickTarget: onClickMoreMenu } = useClickOutside();
  const { show: showMap, ref: mapRef, onClickTarget: onClickMap } = useClickOutside();

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
      </div>
      <StoryImages images={images} size="w-full h-[468px] mobile:h-[300px]" />
      <StoryContents title={title} story={story} storyId={storyId} />
    </div>
  );
};

export default Preview;
