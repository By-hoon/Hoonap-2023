import getDocument from "@/firebase/firestore/getDocument";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import Layout from "@/components/common/Layout";
import { useContext, useEffect, useRef, useState } from "react";
import Router, { useRouter } from "next/router";
import BasicImage from "@/components/common/BasicImage";
import dynamic from "next/dynamic";
import MapOption from "@/components/MapOption";
import Button from "@/components/common/Button";
import { Icon } from "@iconify/react";
import { StoryProps } from "../story/detail";
import withHead from "@/components/hoc/withHead";
import {
  ALERT_TITLE,
  ALERT_CONTENT,
  CONFIRM_TITLE,
  CONFIRM_CONTENT,
  HEAD_TITLE,
  HEAD_DESCRIPTION,
} from "@/shared/constants";
import { PopUpContext } from "@/context/popUpProvider";
import { cardSizeCalculator, getElapsedTime, isExp } from "@/utils/util";
import { useAuth } from "@/context/authProvider";
import useRegular from "@/hooks/useRegular";
import updateField from "@/firebase/firestore/updateField";
import deleteFieldFunc from "@/firebase/firestore/deleteField";
import ProfileImage from "@/components/user/ProfileImage";
import useClickOutside from "@/hooks/useClickOutside";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

const UserDetail = () => {
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [section, setSection] = useState("gallery");
  const [stories, setStories] = useState<StoryProps[]>([]);
  const [paths, setPaths] = useState<[{ latitude: number; longitude: number }[]]>([[]]);
  const [storyIds, setStoryIds] = useState<string[]>([]);
  const [curPolygonNumber, setCurPolygonNumber] = useState<number>();
  const [images, setImages] = useState<{ urls: string[]; storyId: string }[]>([]);
  const [isRegulars, setIsRegulars] = useState(true);
  const [regularMe, setRegularMe] = useState<{
    [key: string]: { id: string; nickname: string; profileImage: string };
  }>({});
  const [regularMy, setRegularMy] = useState<{
    [key: string]: { id: string; nickname: string; profileImage: string };
  }>({});

  const [cardSize, setCardSize] = useState(0);

  const sizeRef = useRef<HTMLDivElement>(null);

  const mapRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { userId } = router.query;

  const {
    show: showRegularManagement,
    ref: regularManagementRef,
    onClickTarget: onClickRegularManagement,
  } = useClickOutside();
  const { user: accessUser } = useAuth();

  const { regular, setRegular } = useRegular(accessUser?.uid);

  const { alert, confirm } = useContext(PopUpContext);

  const clickMap = (polygonNumber?: number) => {
    if (polygonNumber === undefined) {
      setCurPolygonNumber(undefined);
      return;
    }

    setCurPolygonNumber(polygonNumber);
  };

  const registerRegular = async () => {
    const curDate = Date.now();

    await updateField("regulars", accessUser?.uid || "", userId as string, {
      date: curDate,
    });
    await updateField("regular-owner", userId as string, accessUser?.uid || "", {
      date: curDate,
    });

    const newRegular = JSON.parse(JSON.stringify(regular));

    setRegular(Object.assign(newRegular, { [userId as string]: true }));
  };

  const deleteRegular = async () => {
    await deleteFieldFunc("regulars", accessUser?.uid || "", userId as string);
    await deleteFieldFunc("regular-owner", userId as string, accessUser?.uid || "");

    const newRegular = JSON.parse(JSON.stringify(regular));
    delete newRegular[userId as string];

    setRegular(newRegular);
  };

  const deleteRegularMy = async (targetId: string, targetNickname: string) => {
    const result = await confirm(
      CONFIRM_TITLE.DELETE_REGULAR_MY,
      `${CONFIRM_CONTENT.DELETE_REGULAR_MY}: ${targetNickname}`
    );
    if (!result) return;

    await deleteFieldFunc("regular-owner", targetId, userId as string);
    await deleteFieldFunc("regulars", userId as string, targetId);

    const newRegularMy = JSON.parse(JSON.stringify(regularMy));
    delete newRegularMy[targetId];

    setRegularMy(newRegularMy);

    const newRegular = JSON.parse(JSON.stringify(regular));
    delete newRegular[targetId];

    setRegular(newRegular);
  };

  const deleteRegularMe = async (targetId: string, targetNickname: string) => {
    const result = await confirm(
      CONFIRM_TITLE.DELETE_REGULAR_ME,
      `${CONFIRM_CONTENT.DELETE_REGULAR_ME}: ${targetNickname}`
    );
    if (!result) return;

    await deleteFieldFunc("regulars", targetId, userId as string);
    await deleteFieldFunc("regular-owner", userId as string, targetId);

    const newRegularMe = JSON.parse(JSON.stringify(regularMe));
    delete newRegularMe[targetId];

    setRegularMe(newRegularMe);
  };

  const sectionRender = () => {
    switch (section) {
      case "gallery": {
        return (
          <div ref={sizeRef} className="flex flex-wrap mt-[10px]">
            {images.map((image) =>
              image.urls.map((imageUrl) => (
                <Link
                  key={imageUrl}
                  href={{
                    pathname: "/user/story",
                    query: { storyId: image.storyId, stories: JSON.stringify(stories) },
                  }}
                  className="cursor-pointer mx-[5px] mb-[10px]"
                  style={{
                    width: `${cardSize}px`,
                    height: `${cardSize}px`,
                  }}
                  as="/user/story"
                >
                  <BasicImage
                    style={"relative w-full h-full rounded-[10px] bg-black overflow-hidden"}
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
          <div ref={mapRef} className="main-relative">
            <div className="main-absolute">
              {paths[0][0] ? (
                <Map location={{ latitude: paths[0][0].latitude, longitude: paths[0][0].longitude }}>
                  <MapOption
                    paths={paths.map((path, index) => ({ pathArray: path, storyId: storyIds[index] }))}
                    clickMap={clickMap}
                  />
                  {curPolygonNumber !== undefined ? (
                    <Link
                      href={{
                        pathname: "/user/story",
                        query: {
                          storyId: stories[curPolygonNumber].storyId,
                          stories: JSON.stringify(stories),
                        },
                      }}
                      as="/user/story"
                    >
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[300px] h-[140px] bg-white rounded-[10px] shadow-basic pt-[10px] pb-[5px]">
                        <div className="h-[105px] grid grid-cols-[100px_1fr] px-[10px]">
                          <BasicImage
                            style={"relative w-full h-[100px] bg-black rounded-[5px]"}
                            url={stories[curPolygonNumber].images[0]}
                            alt={"user-story-image"}
                          />
                          <div className="text-semibold ml-[5px] break-all">
                            {stories[curPolygonNumber].title}
                            <span className="text-[12px] text-zinc-400 ml-[3px]">
                              {getElapsedTime(stories[curPolygonNumber].createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="h-[20px] text-[12px] text-center text-zinc-400 px-[10px]">
                          스토리를 자세히 보려면 클릭하세요
                        </div>
                      </div>
                    </Link>
                  ) : null}
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
      alert(ALERT_TITLE.ACCESS, ALERT_CONTENT.NO_USER);
      Router.push("/");
      return;
    }

    if (isExp(userId as string)) {
      alert(ALERT_TITLE.EXP, ALERT_CONTENT.INVALID_EXP);
      Router.push("/");
      return;
    }
    const getUserData = async () => {
      const userStoryResult = await getDocument("users", userId as string);

      if (!userStoryResult) {
        setNickname("unknown");
        return;
      }

      setNickname(userStoryResult.nickname);
      setProfileImage(userStoryResult.profileImage);

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

    const getRegularMeData = async () => {
      const regularMeResult = await getDocument("regular-owner", userId as string);
      if (!regularMeResult) return;

      const newRegularMe: { [key: string]: { id: string; nickname: string; profileImage: string } } = {};
      const promise = Object.keys(regularMeResult).map(async (regularKey) => {
        const result = await getDocument("users", regularKey);
        if (!result) {
          newRegularMe[regularKey] = { id: regularKey, nickname: "unknown", profileImage: "" };
          return;
        }

        newRegularMe[regularKey] = {
          id: regularKey,
          nickname: result.nickname,
          profileImage: result.profileImage,
        };
      });
      await Promise.all(promise);

      setRegularMe(newRegularMe);
    };

    getUserData();
    getRegularMeData();
  }, [alert, userId]);

  useEffect(() => {
    const regularKeys = Object.keys(regular);
    if (regularKeys.length === 0) {
      setRegularMy({});
      return;
    }

    const getRegularMyData = async () => {
      const newRegularMy: { [key: string]: { id: string; nickname: string; profileImage: string } } = {};
      const promise = Object.keys(regular).map(async (regularKey) => {
        const result = await getDocument("users", regularKey);
        if (!result) {
          newRegularMy[regularKey] = { id: regularKey, nickname: "unknown", profileImage: "" };
          return;
        }

        newRegularMy[regularKey] = {
          id: regularKey,
          nickname: result.nickname,
          profileImage: result.profileImage,
        };
      });
      await Promise.all(promise);

      setRegularMy(newRegularMy);
    };

    getRegularMyData();
  }, [regular]);

  useEffect(() => {
    if (section !== "map") return;

    mapRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [section]);

  useEffect(() => {
    if (section !== "gallery") return;

    const handleResize = () => {
      if (!sizeRef.current) return;
      const curWidth = sizeRef.current?.offsetWidth - 1;

      const curSize = cardSizeCalculator(curWidth);

      setCardSize(curSize);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [section]);

  if (!userId)
    return (
      <Layout>
        <div></div>
      </Layout>
    );

  return (
    <Layout>
      <div className="w-full max-w-[768px] min-w-[320px] mx-auto my-0">
        <div className="flex items-center border-b-2 p-[15px]">
          <ProfileImage
            imageUrl={profileImage}
            nickname={nickname}
            style={"w-[100px] h-[100px] text-[28px]"}
          />
          <div className="ml-[10px]" ref={regularManagementRef}>
            <div className="text-[18px] font-semibold break-all">{nickname}</div>
            <div className="text-[14px] mt-[10px]">
              {accessUser?.uid === userId ? (
                <>
                  <Button
                    text={"내 정보 수정"}
                    style={"bg-zinc-200 hover:bg-zinc-300 rounded-[15px] px-[10px] py-[6px]"}
                    onClick={() => {
                      Router.push(
                        {
                          pathname: "/user/edit",
                          query: { userId },
                        },
                        "/user/edit"
                      );
                    }}
                  />
                  <Button
                    text={"단골 관리"}
                    style={"bg-zinc-200 hover:bg-zinc-300 rounded-[15px] px-[10px] py-[6px] ml-[5px]"}
                    onClick={() => {
                      onClickRegularManagement();
                    }}
                  />
                </>
              ) : (
                <>
                  {regular[userId as string] ? (
                    <Button
                      text={"단골중"}
                      style={"bg-zinc-200 hover:bg-zinc-300 rounded-[15px] px-[10px] py-[6px]"}
                      onClick={deleteRegular}
                    />
                  ) : (
                    <Button
                      text={"단골하기"}
                      style={"text-white bg-bc hover:bg-bcd rounded-[15px] px-[10px] py-[6px]"}
                      onClick={registerRegular}
                    />
                  )}
                </>
              )}
            </div>
            {showRegularManagement ? (
              <div>
                <div className="background-shadow !fixed" onClick={onClickRegularManagement} />
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] mobile:w-[250px] font-semibold text-[14px] bg-white px-[5px] rounded-[6px] z-30">
                  <div className="text-center text-[20px] font-normal mb-[5px] py-[10px]">단골 관리</div>
                  <div className="grid grid-cols-[1fr_1fr] text-center mb-[5px]">
                    <div
                      className={`cursor-pointer border-b pb-[8px] ${isRegulars ? "text-bc border-bc" : ""}`}
                      onClick={() => {
                        setIsRegulars(true);
                      }}
                    >
                      내가 등록한 단골
                    </div>
                    <div
                      className={`cursor-pointer border-b pb-[8px] ${isRegulars ? "" : "text-bc border-bc"}`}
                      onClick={() => {
                        setIsRegulars(false);
                      }}
                    >
                      나를 등록한 단골
                    </div>
                  </div>
                  <div className="h-[450px] mobile:h-[300px] overflow-y-scroll scrollbar-hide">
                    {isRegulars ? (
                      <>
                        {Object.keys(regularMy).map((regularKey) => (
                          <div
                            className="cursor-pointer grid grid-cols-[45px_1fr_60px] my-[10px] px-[5px]"
                            key={regularMy[regularKey].id}
                            onClick={() => {
                              onClickRegularManagement();
                              Router.push(
                                {
                                  pathname: "/user/detail",
                                  query: { userId: regularKey },
                                },
                                "/user/detail"
                              );
                            }}
                          >
                            <ProfileImage
                              imageUrl={regularMy[regularKey].profileImage}
                              nickname={regularMy[regularKey].nickname}
                              style={"flex-middle w-[40px] h-[40px] text-[18px]"}
                            />
                            <div className="flex items-center px-[5px] break-all">
                              {regularMy[regularKey].nickname}
                            </div>
                            <div
                              className="cursor-pointer flex-middle self-center h-[90%] text-[16px] text-white bg-zinc-400 hover:bg-zinc-500 rounded-[5px]"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRegularMy(regularMy[regularKey].id, regularMy[regularKey].nickname);
                              }}
                            >
                              취소
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        {Object.keys(regularMe).map((regularKey) => (
                          <div
                            className="cursor-pointer grid grid-cols-[45px_1fr_60px] my-[10px] px-[5px]"
                            key={regularMe[regularKey].id}
                            onClick={() => {
                              onClickRegularManagement();
                              Router.push(
                                {
                                  pathname: "/user/detail",
                                  query: { userId: regularMe[regularKey].id },
                                },
                                "/user/detail"
                              );
                            }}
                          >
                            <ProfileImage
                              imageUrl={regularMe[regularKey].profileImage}
                              nickname={regularMe[regularKey].nickname}
                              style={"flex-middle w-[40px] h-[40px] text-[18px]"}
                            />
                            <div className="flex items-center px-[5px] break-all">
                              {regularMe[regularKey].nickname}
                            </div>
                            <div
                              className="cursor-pointer flex-middle self-center h-[90%] text-[16px] text-white bg-zinc-400 hover:bg-zinc-500 rounded-[5px]"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRegularMe(regularMe[regularKey].id, regularMe[regularKey].nickname);
                              }}
                            >
                              <span>삭제</span>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
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

export default withHead(UserDetail, HEAD_TITLE.USER_DETAIL, HEAD_DESCRIPTION.USER_DETAIL);
