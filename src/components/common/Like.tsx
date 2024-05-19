import deleteFieldFunc from "@/firebase/firestore/deleteField";
import getDocument from "@/firebase/firestore/getDocument";
import setData from "@/firebase/firestore/setData";
import updateField from "@/firebase/firestore/updateField";
import { Icon } from "@iconify/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface LikeProps {
  imageId: string;
  userId: string;
  likes: { [key: string]: boolean };
  setLikes: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
}

const Like = ({ imageId, userId, likes, setLikes }: LikeProps) => {
  const [curLike, setCurLike] = useState(false);
  const [likeNum, setLikeNum] = useState(0);

  const onChangeLike = (isLike: boolean) => {
    const newLikes = JSON.parse(JSON.stringify(likes));

    if (isLike) {
      doLike(newLikes);
      return;
    }

    doUnLike(newLikes);
  };

  const doLike = async (newLikes: { [key: string]: boolean }) => {
    newLikes[imageId] = true;

    await updateField("likes", userId, imageId, {});
    await updateField("likes-calc", imageId, userId, {});
    setLikes(newLikes);
    setLikeNum(likeNum + 1);
  };

  const doUnLike = async (newLikes: { [key: string]: boolean }) => {
    delete newLikes[imageId];

    await deleteFieldFunc("likes", userId, imageId);
    await deleteFieldFunc("likes-calc", imageId, userId);
    setLikes(newLikes);
    setLikeNum(likeNum - 1);
  };

  useEffect(() => {
    if (imageId === "") return;

    const getLikesCalcData = async () => {
      const result = await getDocument("likes-calc", imageId);
      if (!result || result.empty) {
        const likesNumResult = await setData("likes-calc", imageId, {});
        setLikeNum(0);
        return;
      }

      setLikeNum(Object.keys(result).length);
    };

    getLikesCalcData();
  }, [imageId]);

  useEffect(() => {
    if (imageId === "") return;

    if (likes[imageId]) {
      setCurLike(true);
      return;
    }

    setCurLike(false);
  }, [imageId, likes]);

  return (
    <>
      {curLike ? (
        <Icon
          icon="ph:heart-fill"
          className="cursor-pointer text-[36px] mobile:text-[28px] text-red-600"
          onClick={() => onChangeLike(false)}
        />
      ) : (
        <Icon
          icon="ph:heart"
          className="cursor-pointer text-[36px] mobile:text-[28px] text-white"
          onClick={() => onChangeLike(true)}
        />
      )}
      <div className="md:text-[16px] text-white ml-[5px]">{likeNum}</div>
    </>
  );
};

export default Like;
