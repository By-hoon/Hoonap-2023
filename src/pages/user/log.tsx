import BasicImage from "@/components/common/BasicImage";
import Layout from "@/components/common/Layout";
import getDocument from "@/firebase/firestore/getDocument";
import { cardSizeCalculator } from "@/utils/util";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const Log = () => {
  const [likes, setLikes] = useState<{ imageId: string; imageUrl: string; storyId: string }[]>([]);
  const [cardSize, setCardSize] = useState(0);

  const sizeRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const { userId } = router.query;

  useEffect(() => {
    if (!userId) return;

    const newLikes: { imageId: string; imageUrl: string; storyId: string }[] = [];

    const getUserLikes = async () => {
      const likesResult = await getDocument("likes", userId as string);
      if (!likesResult || likesResult.empty) return;

      Object.keys(likesResult).forEach((imageId) => {
        newLikes.push({ imageId, imageUrl: likesResult[imageId].url, storyId: likesResult[imageId].storyId });
      });

      setLikes(newLikes);
    };

    getUserLikes();
  }, [userId]);

  useEffect(() => {
    const handleResize = () => {
      if (!sizeRef.current) return;
      const curWidth = sizeRef.current?.offsetWidth - 1;

      const curSize = cardSizeCalculator(curWidth);

      setCardSize(curSize);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout>
      <div className="w-[90%] max-w-[768px] mx-auto md:pt-[20px] mobile:pt-[10px] pb-[10px]">
        <div>
          <div className="w-full text-[18px] mobile:text-[16px] font-semibold my-[5px] pl-[10px] pb-[10px] outline-0 border-b border-bs focus:border-bc focus:bg-bcvl">
            좋아요를 표시한 사진들
          </div>
          <div ref={sizeRef} className="flex flex-wrap">
            {likes.map((like) => (
              <div
                key={like.imageId}
                className="cursor-pointer text-[18px] mobile:text-[14px] m-[5px]"
                style={{
                  width: `${cardSize}px`,
                  height: `${cardSize}px`,
                }}
                onClick={() => {
                  router.push(
                    {
                      pathname: "/story/detail",
                      query: { storyId: like.storyId },
                    },
                    "/story/detail"
                  );
                }}
              >
                <BasicImage
                  style={
                    "relative w-full h-full mobile:w-[80px] mobile:h-[80px] rounded-[10px] bg-black overflow-hidden"
                  }
                  url={like.imageUrl}
                  alt={"user-story-image"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Log;
