import useUser from "@/hooks/useUser";
import { StoryProps } from "@/pages/story/detail";
import Link from "next/link";
import MoreMenu from "./MoreMenu";
import { useAuth } from "@/context/authProvider";
import updateField from "@/firebase/firestore/updateField";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import deleteFieldFunc from "@/firebase/firestore/deleteField";

interface StoryHeaderProps {
  story: StoryProps;
  regular: { [key: string]: boolean };
  setRegular: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  style: string;
}

const StoryHeader = ({ story, regular, setRegular, style }: StoryHeaderProps) => {
  const { nickname } = useUser(story.userId);
  const { user } = useAuth();

  if (!user) return <></>;

  const registerRegular = async () => {
    const curDate = Date.now();

    await updateField("regulars", user.uid, story.userId, {
      date: curDate,
    });
    await updateField("regular-owner", story.userId, user.uid, {
      date: curDate,
    });

    const newRegular = JSON.parse(JSON.stringify(regular));

    setRegular(Object.assign(newRegular, { [story.userId]: true }));
  };

  const deleteRegular = async () => {
    await deleteFieldFunc("regulars", user.uid, story.userId);
    await deleteFieldFunc("regular-owner", story.userId, user.uid);

    const newRegular = JSON.parse(JSON.stringify(regular));
    delete newRegular[story.userId];

    setRegular(newRegular);
  };

  return (
    <div className={`flex justify-between ${style}`}>
      <div className="h-full flex flex-wrap items-center">
        <Link
          className="text-[18px]"
          href={{
            pathname: "/user/detail",
            query: { userId: story.userId },
          }}
          as="/user/detail"
        >
          {nickname}
        </Link>
        {user?.uid !== story.userId ? (
          <>
            {regular[story.userId] ? (
              <div className="cursor-pointer text-[14px] text-zinc-400 ml-[5px]" onClick={deleteRegular}>
                단골중
              </div>
            ) : (
              <div className="cursor-pointer text-[14px] text-bc ml-[5px]" onClick={registerRegular}>
                단골하기
              </div>
            )}
          </>
        ) : null}
      </div>
      <MoreMenu
        title={story.title}
        story={story.story}
        paths={story.paths}
        images={story.images}
        createdAt={story.createdAt}
        storyId={story.storyId}
        userId={story.userId}
      />
    </div>
  );
};

export default StoryHeader;
