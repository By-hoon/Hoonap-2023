import Preview from "@/components/story/Preview";
import { useEffect, useRef, useState } from "react";
import Layout from "@/components/common/Layout";
import { isExp } from "@/utils/util";
import { useAuth } from "@/context/authProvider";
import Router from "next/router";
import { StoryProps } from "./detail";
import withHead from "@/components/hoc/withHead";
import { headDescription, headTitle } from "@/shared/constants";
import getPage from "@/firebase/firestore/getPage";

const List = () => {
  const [stories, setStories] = useState<StoryProps[]>([]);
  const [size, setSize] = useState(3);
  const [last, setLast] = useState(0);

  const storyRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const userId = user.uid;

    const getStoriesData = async () => {
      const result = await getPage("stories", size, "createdAt", "desc", last === 0 ? undefined : last);

      if (!result) {
        alert("에러 발생");
        return;
      }
      if (result.empty && last === 0) {
        alert("게시된 스토리가 없습니다.");
        Router.push("/");
        return;
      }
      if (result.empty && last !== 0) {
        alert("더 이상 불러올 스토리가 없습니다.");
        return;
      }

      const newStories = result.docs.map((doc) => Object.assign(doc.data(), { storyId: doc.id }));

      setStories((cur) => cur.concat(newStories as StoryProps[]));
    };

    const getExpStoriesData = () => {
      const storageStories = window.localStorage.getItem("story");
      if (!storageStories) {
        alert("게시된 스토리가 없습니다.");
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
  }, [last, size, user]);

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
            <Preview
              title={story.title}
              story={story.story}
              paths={story.paths}
              images={story.images}
              createdAt={story.createdAt}
              storyId={story.storyId}
              userId={story.userId}
            />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default withHead(List, headTitle.storyList, headDescription.storyList);
