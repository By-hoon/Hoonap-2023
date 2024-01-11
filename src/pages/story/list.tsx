import Preview from "@/components/story/Preview";
import { useContext, useEffect, useRef, useState } from "react";
import Layout from "@/components/common/Layout";
import { isExp } from "@/utils/util";
import { useAuth } from "@/context/authProvider";
import Router from "next/router";
import { StoryProps } from "./detail";
import withHead from "@/components/hoc/withHead";
import { alertContent, alertTitle, headDescription, headTitle } from "@/shared/constants";
import getPage from "@/firebase/firestore/getPage";
import useRegular from "@/hooks/useRegular";
import { PopUpContext } from "@/context/popUpProvider";
import { Icon } from "@iconify/react";
import getDocument from "@/firebase/firestore/getDocument";

const List = () => {
  const [stories, setStories] = useState<StoryProps[]>([]);
  const [regulars, setRegulars] = useState<{ id: string; nickname: string }[]>([]);
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
      alert(alertTitle.exp, alertContent.invalidExp);
      return;
    }
    if (target === category) {
      alert("", alertContent.sameCategory);
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
        alert(alertTitle.server, alertContent.unknown);
        return;
      }
      if (result.empty && last === 0) {
        alert(alertTitle.access, alertContent.nothingStory);
        Router.push("/");
        return;
      }
      if (result.empty && last !== 0) {
        alert("", alertContent.noMoreStory);
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
        alert("", alertContent.nothingStory);
        return;
      }
      setStories((cur) => cur.concat(newStories as StoryProps[]));
    };

    const getExpStoriesData = () => {
      const storageStories = window.localStorage.getItem("story");
      if (!storageStories) {
        alert(alertTitle.access, alertContent.nothingStory);
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
      const newRegulars: { id: string; nickname: string }[] = [];
      const promise = regularKeys.map(async (regularKey) => {
        const result = await getDocument("users", regularKey);
        if (!result) {
          newRegulars.push({ id: regularKey, nickname: "unknown" });
          return;
        }

        newRegulars.push({ id: regularKey, nickname: result.nickname });
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
      <div className="p-[10px]">
        {stories.map((story) => (
          <div key={story.storyId} ref={storyRef}>
            <Preview story={story} regular={regular} setRegular={setRegular} />
          </div>
        ))}
      </div>
      <div className="fixed top-[50%] right-[5px] -translate-y-1/2 w-[130px] border">
        <div
          onClick={() => {
            changeCategory("basic");
          }}
        >
          <Icon icon="ic:round-home" />
          <div>기본</div>
        </div>
        <div
          onClick={() => {
            changeCategory("my");
          }}
        >
          <Icon icon="icon-park-outline:me" />
          <div>My</div>
        </div>
        <div
          onClick={() => {
            changeCategory("regular");
          }}
        >
          <Icon icon="icon-park-outline:every-user" />
          <div>단골</div>
        </div>
      </div>
      <div className="fixed top-[50%] left-[5px] -translate-y-1/2 w-[130px] border">
        {regulars.map((regularUser) => (
          <div
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
            {regularUser.nickname}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default withHead(List, headTitle.storyList, headDescription.storyList);
