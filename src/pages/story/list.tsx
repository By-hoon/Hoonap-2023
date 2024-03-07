import Preview from "@/components/story/Preview";
import { useContext, useEffect, useRef, useState } from "react";
import Layout from "@/components/common/Layout";
import { isExp } from "@/utils/util";
import { useAuth } from "@/context/authProvider";
import Router from "next/router";
import { StoryProps } from "./detail";
import withHead from "@/components/hoc/withHead";
import { ALERT_TITLE, ALERT_CONTENT, HEAD_TITLE, HEAD_DESCRIPTION } from "@/shared/constants";
import getPage from "@/firebase/firestore/getPage";
import useRegular from "@/hooks/useRegular";
import { PopUpContext } from "@/context/popUpProvider";
import { Icon } from "@iconify/react";
import getDocument from "@/firebase/firestore/getDocument";
import ProfileImage from "@/components/user/ProfileImage";

const List = () => {
  const [stories, setStories] = useState<StoryProps[]>([]);
  const [regulars, setRegulars] = useState<{ id: string; nickname: string; profileImage: string }[]>([]);
  const [category, setCategory] = useState("basic");
  const [size, setSize] = useState(3);
  const [last, setLast] = useState(0);

  const storyRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const { regular, setRegular } = useRegular(user?.uid);

  const { alert } = useContext(PopUpContext);

  const changeCategory = (target: string) => {
    if (!user) return;
    if (isExp(user.uid)) {
      alert(ALERT_TITLE.EXP, ALERT_CONTENT.INVALID_EXP);
      return;
    }
    if (target === category) {
      alert("", ALERT_CONTENT.SAME_CATEGORY);
      return;
    }

    setCategory(target);
    setStories([]);
    setLast(0);
  };

  useEffect(() => {
    if (!user) return;
    const userId = user.uid;

    const getStoriesData = async () => {
      const result = await getPage("stories", size, "createdAt", "desc", last === 0 ? undefined : last);

      if (!result) {
        alert(ALERT_TITLE.SERVER, ALERT_CONTENT.UNKNOWN);
        return;
      }
      if (result.empty && last === 0) {
        alert(ALERT_TITLE.ACCESS, ALERT_CONTENT.NOTHING_STORY);
        Router.push("/");
        return;
      }
      if (result.empty && last !== 0) {
        alert("", ALERT_CONTENT.NO_MORE_STORY);
        return;
      }
      const newStories: StoryProps[] = [];
      result.docs.forEach((doc) => {
        if (category === "basic") {
          newStories.push(Object.assign(doc.data(), { storyId: doc.id }) as StoryProps);
          return;
        }

        if (category === "my") {
          if (doc.data().userId !== user.uid) return;
          newStories.push(Object.assign(doc.data(), { storyId: doc.id }) as StoryProps);
        }

        if (category === "regular") {
          if (!regular[doc.data().userId]) return;
          newStories.push(Object.assign(doc.data(), { storyId: doc.id }) as StoryProps);
        }
      });

      if (stories.length === 0 && newStories.length === 0) {
        alert("", ALERT_CONTENT.NOTHING_STORY);
        return;
      }
      setStories((cur) => cur.concat(newStories as StoryProps[]));
    };

    const getExpStoriesData = () => {
      const storageStories = window.localStorage.getItem("story");
      if (!storageStories) {
        alert(ALERT_TITLE.ACCESS, ALERT_CONTENT.NOTHING_STORY);
        Router.push("/");
        return;
      }

      const expStories = JSON.parse(storageStories);

      const newStories: StoryProps[] = Object.keys(expStories).map((key) => ({
        title: expStories[key].title,
        story: expStories[key].story,
        paths: expStories[key].paths,
        images: expStories[key].images,
        createdAt: expStories[key].createdAt,
        storyId: key,
        userId: expStories[key].userId,
      }));
      setStories(newStories);
    };

    if (isExp(userId)) {
      getExpStoriesData();
      return;
    }
    getStoriesData();
  }, [alert, category, last, size, user]);

  useEffect(() => {
    const regularKeys = Object.keys(regular);
    if (regularKeys.length === 0) {
      setRegulars([]);
      return;
    }

    const getRegularUserData = async () => {
      const newRegulars: { id: string; nickname: string; profileImage: string }[] = [];
      const promise = regularKeys.map(async (regularKey) => {
        const result = await getDocument("users", regularKey);
        if (!result) {
          newRegulars.push({ id: regularKey, nickname: "unknown", profileImage: "" });
          return;
        }

        newRegulars.push({ id: regularKey, nickname: result.nickname, profileImage: result.profileImage });
      });
      await Promise.all(promise);

      setRegulars(newRegulars);
    };

    getRegularUserData();
  }, [regular]);

  useEffect(() => {
    const onIntersect: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && stories.length !== 0) {
          setLast(stories[stories.length - 1].createdAt);
          observer.unobserve(entry.target);
        }
      });
    };

    let observer: IntersectionObserver;
    if (storyRef.current) {
      observer = new IntersectionObserver(onIntersect, { threshold: 0.9 });
      observer.observe(storyRef.current);
    }
    return () => observer && observer.disconnect();
  }, [stories, storyRef]);

  if (!user)
    return (
      <Layout>
        <div></div>
      </Layout>
    );
  return (
    <Layout>
      <div className="p-[10px] mobile:pt-[65px] mobile:pb-[45px]">
        {stories.map((story) => (
          <div key={story.storyId} ref={storyRef}>
            <Preview story={story} regular={regular} setRegular={setRegular} />
          </div>
        ))}
      </div>
      <div
        className="fixed md:top-[50%] md:right-[5px] lg:right-[10%] md:-translate-y-1/2 md:w-[90px] md:border md:rounded-[5px] md:shadow-basic
      mobile:bottom-0 mobile:left-0 mobile:flex-middle mobile:w-full mobile:h-[45px] mobile:z-[30] p-[5px] bg-white"
      >
        <div
          className="cursor-pointer flex items-center md:my-[5px] mobile:mx-[5px]"
          onClick={() => {
            changeCategory("basic");
          }}
        >
          <Icon className="text-[24px]" icon="ic:round-home" />
          <div className="text-[14px] md:ml-[8px] mobile:mx-[3px]">기본</div>
        </div>
        <div
          className="cursor-pointer flex items-center md:my-[5px] mobile:mx-[5px]"
          onClick={() => {
            changeCategory("my");
          }}
        >
          <Icon className="text-[24px]" icon="icon-park-outline:me" />
          <div className="text-[14px] md:ml-[8px] mobile:mx-[3px]">사용자</div>
        </div>
        <div
          className="cursor-pointer flex items-center md:my-[5px] mobile:mx-[5px]"
          onClick={() => {
            changeCategory("regular");
          }}
        >
          <Icon className="text-[24px]" icon="icon-park-outline:every-user" />
          <div className="text-[14px] md:ml-[8px] mobile:mx-[3px]">단골</div>
        </div>
      </div>
      <div
        className="fixed flex md:top-[50%] md:left-[5px] lg:left-[10%] md:-translate-y-1/2 md:justify-center md:w-[100px] text-[14px] md:border md:rounded-[5px] md:shadow-basic
      mobile:top-[45px] mobile:left-0 mobile:items-center mobile:w-full mobile:h-[65px] mobile:border-b mobile:z-[30] p-[5px] bg-white"
      >
        {regulars.length !== 0 ? (
          regulars.map((regularUser) => (
            <div
              className="cursor-pointer"
              key={regularUser.id}
              onClick={() => {
                Router.push(
                  {
                    pathname: "/user/detail",
                    query: { userId: regularUser.id },
                  },
                  "/user/detail"
                );
              }}
            >
              <ProfileImage
                imageUrl={regularUser.profileImage}
                nickname={regularUser.nickname}
                style={"w-[40px] h-[40px] mobile:w-[32px] mobile:h-[32px] text-[14px] mx-auto md:my-[5px]"}
              />
              <div className="text-[12px] mobile:text-[10px] break-all">{regularUser.nickname}</div>
            </div>
          ))
        ) : (
          <div className="text-[12px] text-center">단골을 등록해 보세요!</div>
        )}
      </div>
    </Layout>
  );
};

export default withHead(List, HEAD_TITLE.STORY_LIST, HEAD_DESCRIPTION.STORY_LIST);
