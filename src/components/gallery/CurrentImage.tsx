import { Dispatch, SetStateAction, useEffect, useState } from "react";
import BasicImage from "../common/BasicImage";
import Link from "next/link";
import { Icon } from "@iconify/react";
import updateField from "@/firebase/firestore/updateField";
import { getImageId } from "@/utils/util";
import deleteFieldFunc from "@/firebase/firestore/deleteField";
import getDocument from "@/firebase/firestore/getDocument";
import setData from "@/firebase/firestore/setData";

interface CurrentImageProps {
  current: number | undefined;
  setCurrent: Dispatch<SetStateAction<number | undefined>>;
  images: {
    url: string;
    userId: string;
    id: string;
  }[];
  likes: { [key: string]: boolean };
  setLikes: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  userId: string;
}

const CurrentImage = ({ current, setCurrent, images, likes, setLikes, userId }: CurrentImageProps) => {
  const [imageId, setImageId] = useState("");
  const [curLike, setCurLike] = useState(false);
  const [likeNum, setLikeNum] = useState(0);

  const onChangeLike = (isLike: boolean) => {
    if (current === undefined) return;

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
    setCurLike(true);
    setLikes(newLikes);
    setLikeNum(likeNum + 1);
  };

  const doUnLike = async (newLikes: { [key: string]: boolean }) => {
    delete newLikes[imageId];

    await deleteFieldFunc("likes", userId, imageId);
    await deleteFieldFunc("likes-calc", imageId, userId);
    setCurLike(false);
    setLikes(newLikes);
    setLikeNum(likeNum - 1);
  };

  const preImage = () => {
    if (current === undefined) return;

    if (current === 0) {
      setCurrent(images.length - 1);
      return;
    }
    setCurrent(current - 1);
  };
  const nextImage = () => {
    if (current === undefined) return;

    if (current === images.length - 1) {
      setCurrent(0);
      return;
    }
    setCurrent(current + 1);
  };

  useEffect(() => {
    if (current === undefined) return;

    const curImageId = getImageId(images[current].url);

    setImageId(curImageId);

    if (likes[curImageId]) {
      setCurLike(true);
      return;
    }

    setCurLike(false);
  }, [current]);

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

  return (
    <>
      {current !== undefined ? (
        <>
          <div
            className="background-shadow z-[110]"
            onClick={() => {
              setCurrent(undefined);
            }}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-[10px] z-[120]">
            <BasicImage
              style={"relative w-[768px] h-[768px] mobile:w-[300px] mobile:h-[300px]"}
              url={images[current].url}
              alt={"current-image"}
            >
              <div className="flex justify-between w-full absolute top-[50%] left-[0] translate-y-[-50%] text-[28px] text-white opacity-60 px-[10px]">
                <figcaption className="cursor-pointer" onClick={preImage}>
                  <Icon icon="icon-park-solid:left-c" />
                </figcaption>
                <figcaption className="cursor-pointer" onClick={nextImage}>
                  <Icon icon="icon-park-solid:right-c" />
                </figcaption>
              </div>
              <div>
                <div className="absolute bottom-0 left-[20px] mobile:left-[10px] h-[80px] mobile:h-[60px] flex items-center z-20">
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
                </div>
                <div className="absolute bottom-0 left-0 w-full h-[80px] mobile:h-[60px] flex-middle bg-black bg-opacity-30">
                  <Link
                    className="w-[210px] h-[50px] text-white text-[24px] text-center mobile:w-[150px] mobile:h-[35px] mobile:text-[16px] border rounded-[10px] px-[10px] py-[5px]"
                    href={{
                      pathname: "/story/detail",
                      query: { storyId: images[current].id },
                    }}
                    as="/story/detail"
                  >
                    스토리 보러가기
                  </Link>
                </div>
              </div>
            </BasicImage>
          </div>
        </>
      ) : null}
    </>
  );
};

export default CurrentImage;
