import Preview from "@/components/story/Preview";
import { useContext, useEffect, useState } from "react";
import Layout from "@/components/common/Layout";
import { isExp } from "@/utils/util";
import { useAuth } from "@/context/authProvider";
import Router from "next/router";
import { StoryProps } from "./detail";
import getCollection from "@/firebase/firestore/getCollection";
import { deleteFile } from "@/firebase/storage/delete";
import { PopUpContext } from "@/context/popUpProvider";
import deleteDocument from "@/firebase/firestore/deleteDocument";
import getDocument from "@/firebase/firestore/getDocument";
import updateField from "@/firebase/firestore/updateField";

const List = () => {
  const [stories, setStories] = useState<{ [key: string]: StoryProps }>({});

  const { user } = useAuth();

  const { confirm } = useContext(PopUpContext);

  const deleteExpStory = (storyId: string) => {
    if (Object.keys(stories).length === 1) {
      window.localStorage.clear();
      setStories({});
      return;
    }

    const newExpStories: { [key: string]: StoryProps } = {};
    const newExpPaths: {
      [key: string]: { paths: { latitude: number; longitude: number }[]; storyId: string };
    } = {};
    const newExpImages: { [key: string]: { images: string[]; storyId: string } } = {};

    Object.keys(stories).forEach((key) => {
      if (key === storyId) return;

      newExpStories[key] = stories[key];
      newExpPaths[key] = {
        paths: stories[key].paths,
        storyId: stories[key].storyId,
      };
      newExpImages[key] = {
        images: stories[key].images,
        storyId: stories[key].storyId,
      };
    });

    window.localStorage.setItem("story", JSON.stringify(newExpStories));
    window.localStorage.setItem("path", JSON.stringify(newExpPaths));
    window.localStorage.setItem("image", JSON.stringify(newExpImages));

    setStories(newExpStories);
  };

  const deleteStory = async (storyId: string, userId: string) => {
    const result = await confirm("스토리를 삭제하시겠습니까?", "삭제된 스토리는 다시 복구할 수 없습니다.");
    if (!result) return;

    for (let i = 0; i < stories[storyId].images.length; i++) {
      await deleteFile(stories[storyId].images[i]);
    }

    if (isExp(user?.uid as string)) {
      deleteExpStory(storyId);
      return;
    }
    const newStories = JSON.parse(JSON.stringify(stories));
    delete newStories[storyId];

    await deleteDocument("stories", storyId);
    await deleteDocument("paths", storyId);
    await deleteDocument("images", storyId);

    updateUserStoryIds(storyId, userId);

    setStories(newStories);
  };

  const updateUserStoryIds = async (storyId: string, userId: string) => {
    const userData = await getDocument("users", userId);
    if (!userData) return;

    const storyIds = userData.storyIds;

    const newStoryIds = storyIds.length == 1 ? null : storyIds.filter((e: string) => e != storyId);

    await updateField("users", userId, "storyIds", newStoryIds);
  };

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
              deleteStory={deleteStory}
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
