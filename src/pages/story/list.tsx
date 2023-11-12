import Preview from "@/components/story/Preview";
import { useEffect, useState } from "react";
import Layout from "@/components/common/Layout";
import { isExp } from "@/utils/util";
import { useAuth } from "@/context/authProvider";
import Router from "next/router";
import { StoryProps } from "./detail";
import getCollection from "@/firebase/firestore/getCollection";

const List = () => {
  const [stories, setStories] = useState<{ [key: string]: StoryProps }>({});

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const userId = user.uid;

    const getStoriesData = async () => {
      const result = await getCollection("stories");
      if (!result) {
        alert("게시된 스토리가 없습니다.");
        Router.push("/");
        return;
      }

      const newStories: { [key: string]: StoryProps } = {};
      result.docs.forEach((doc) => {
        const storyData = doc.data();
        const storyId = doc.id;
        newStories[storyId] = {
          title: storyData.title,
          story: storyData.story,
          paths: storyData.paths,
          images: storyData.images,
          storyId,
          userId: storyData.userId,
        };
      });

      setStories(newStories);
    };

    const getExpStoriesData = () => {
      const storageStories = window.localStorage.getItem("story");
      if (!storageStories) {
        alert("게시된 스토리가 없습니다.");
        Router.push("/");
        return;
      }

      const expStories = JSON.parse(storageStories);

      const newStories: { [key: string]: StoryProps } = {};
      Object.keys(expStories).forEach((key) => {
        newStories[key] = {
          title: expStories[key].title,
          story: expStories[key].story,
          paths: expStories[key].paths,
          images: expStories[key].images,
          storyId: key,
          userId: expStories[key].userId,
        };
      });
      setStories(newStories);
    };

    if (isExp(userId)) {
      getExpStoriesData();
      return;
    }
    getStoriesData();
  }, [user]);

  if (!user)
    return (
      <Layout>
        <div></div>
      </Layout>
    );
  return (
    <Layout>
      <div className="p-[10px]">
        {Object.keys(stories).map((key) => (
          <div key={key}>
            <Preview
              title={stories[key].title}
              story={stories[key].story}
              paths={stories[key].paths}
              images={stories[key].images}
              storyId={stories[key].storyId}
              userId={stories[key].userId}
            />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default List;
