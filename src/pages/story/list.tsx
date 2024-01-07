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

const List = () => {
  const [stories, setStories] = useState<StoryProps[]>([]);
  const [size, setSize] = useState(3);
  const [last, setLast] = useState(0);

  const storyRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const { regular } = useRegular(user?.uid);

  const { alert } = useContext(PopUpContext);

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

      const newStories = result.docs.map((doc) => Object.assign(doc.data(), { storyId: doc.id }));

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
  }, [alert, last, size, user]);

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
            <Preview story={story} regular={regular} />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default withHead(List, headTitle.storyList, headDescription.storyList);
