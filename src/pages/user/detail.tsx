import getDocument from "@/firebase/firestore/getDocument";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import Layout from "@/components/common/Layout";
import { useContext, useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import BasicImage from "@/components/common/BasicImage";
import dynamic from "next/dynamic";
import MapOption from "@/components/MapOption";
import Button from "@/components/common/Button";
import { Icon } from "@iconify/react";
import { StoryProps } from "../story/detail";
import withHead from "@/components/hoc/withHead";
import { alertContent, alertTitle, headDescription, headTitle } from "@/shared/constants";
import { PopUpContext } from "@/context/popUpProvider";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

const UserDetail = () => {
  const [nickname, setNickname] = useState("");
  const [section, setSection] = useState("gallery");
  const [stories, setStories] = useState<StoryProps[]>([]);
  const [paths, setPaths] = useState<[{ latitude: number; longitude: number }[]]>([[]]);
  const [storyIds, setStoryIds] = useState<string[]>([]);
  const [images, setImages] = useState<{ urls: string[]; storyId: string }[]>([]);

  const router = useRouter();
  const { userId } = router.query;

  const { alert } = useContext(PopUpContext);

  const clickMap = (storyId?: string) => {
    if (!storyId) return;
    router.push(
      {
        pathname: "/user/story",
        query: { storyId: storyId, stories: JSON.stringify(stories) },
      },
      "/user/story"
    );
  };

  const sectionRender = () => {
    switch (section) {
      case "gallery": {
        return (
          <div className="flex flex-wrap justify-around p-[5px]">
            {images.map((image) =>
              image.urls.map((imageUrl) => (
                <Link
                  key={imageUrl}
                  href={{
                    pathname: "/user/story",
                    query: { storyId: image.storyId, stories: JSON.stringify(stories) },
                  }}
                  as="/story/detail"
                >
                  <BasicImage
                    style={"relative w-[130px] h-[130px] rounded-[5px] border-2 mx-[5px] my-[10px] p-[5px]"}
                    url={imageUrl}
                    alt={"user-story-image"}
                  />
                </Link>
              ))
            )}
          </div>
        );
      }
      case "map": {
        return (
          <div className="main-relative">
            <div className="main-absolute">
              {paths[0][0] ? (
                <Map location={{ latitude: paths[0][0].latitude, longitude: paths[0][0].longitude }}>
                  <MapOption
                    paths={paths.map((path, index) => ({ pathArray: path, storyId: storyIds[index] }))}
                    clickMap={clickMap}
                  />
                </Map>
              ) : null}
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  useEffect(() => {
    if (!userId) {
      alert(alertTitle.access, alertContent.noUser);
      Router.push("/story/list");
      return;
    }

    const getUserData = async () => {
      const userStoryResult = await getDocument("users", userId as string);

      if (!userStoryResult) {
        setNickname("unknown");
        return;
      }
      setNickname(userStoryResult.nickname);

      const stories: StoryProps[] = [];
      const paths: [{ latitude: number; longitude: number }[]] = [[]];
      const storyIds: string[] = [];
      const images: { urls: string[]; storyId: string }[] = [];

      const promises = userStoryResult.storyIds.map(async (storyId: string) => {
        const storyResult = await getDocument("stories", storyId);
        if (!storyResult) return;
        stories.push({
          title: storyResult.title,
          story: storyResult.story,
          paths: storyResult.paths,
          images: storyResult.images,
          createdAt: storyResult.createdAt,
          storyId,
          userId: storyResult.userId,
        });
        paths.push(storyResult.paths);
        storyIds.push(storyId);
        images.push({ urls: storyResult.images, storyId });
      });

      await Promise.all(promises);
      paths.shift();

      setStories(stories);
      setPaths(paths);
      setStoryIds(storyIds);
      setImages(images);
    };
    getUserData();
  }, [alert, userId]);

  if (!userId)
    return (
      <Layout>
        <div></div>
      </Layout>
    );
  return (
    <Layout>
      <div className="w-full max-w-[768px] min-w-[320px] mx-auto my-0">
        <div className="border-b-2 p-[15px]">
          <div className="text-[18px] font-semibold">{nickname}</div>
        </div>
        <div className="flex justify-between mt-[20px] px-[10px]">
          <Button
            text={<Icon icon="solar:gallery-bold" />}
            style={`w-[50%] flex justify-center text-[28px] text-center pb-[10px] 
            ${section === "gallery" ? "border-b-2 border-bc" : ""}`}
            onClick={() => {
              setSection("gallery");
            }}
          />
          <Button
            text={<Icon icon="bx:map" />}
            style={`w-[50%] flex justify-center text-[28px] text-center pb-[10px] 
            ${section === "map" ? "border-b-2 border-bc" : ""}`}
            onClick={() => {
              setSection("map");
            }}
          />
        </div>
        {sectionRender()}
      </div>
    </Layout>
  );
};

export default withHead(UserDetail, headTitle.userDetail, headDescription.userDetail);
