import getCollection from "@/firebase/firestore/getCollection";
import getDocument from "@/firebase/firestore/getDocument";
import { useEffect, useState } from "react";
import BasicImage from "./common/BasicImage";
import Link from "next/link";
import { Icon } from "@iconify/react";

type BestImage = {
  imageId: string;
  imageUrl: string;
  likeCount: number;
  storyId: string;
  userId: string;
};

const Best = () => {
  const [bestImages, setBestImages] = useState<BestImage[]>([]);

  useEffect(() => {
    const getLikesData = async () => {
      const likeResult = await getCollection("likes-calc");
      if (!likeResult || likeResult.empty) return;

      const LikesData: BestImage[] = [];

      const promise = likeResult.docs.map(async (doc) => {
        const curData = doc.data();

        const curLikeCount = Object.keys(curData).length;
        if (!curLikeCount) return;

        const imageResult = await getDocument("images", doc.id);

        if (!imageResult || imageResult.empty) return;

        LikesData.push({
          imageId: doc.id,
          imageUrl: imageResult.url,
          likeCount: curLikeCount,
          storyId: imageResult.storyId,
          userId: imageResult.userId,
        });
      });

      await Promise.all(promise);

      setBestImages(getBestImages(LikesData));
    };

    const getBestImages = (likesData: BestImage[]) => {
      const newBestImages: BestImage[] = [...likesData];

      newBestImages.sort((a, b) => b.likeCount - a.likeCount);

      return newBestImages.slice(0, 3);
    };

    getLikesData();
  }, []);

  return (
    <div>
      <div>
        <div>인기있는 사진들</div>
        {bestImages.length === 0 ? (
          <div>준비중입니다</div>
        ) : (
          <div className="flex">
            {bestImages.map((bestImage) => (
              <div key={bestImage.imageId} className="w-[200px] h-[200px] mx-[5px]">
                <Link
                  href={{
                    pathname: "/story/detail",
                    query: { storyId: bestImage.storyId },
                  }}
                  as="/story/detail"
                >
                  <BasicImage
                    style={"relative w-full h-full bg-black rounded-[5px]"}
                    url={bestImage.imageUrl}
                    alt={"best-image"}
                  >
                    <div className="absolute bottom-[3px] left-[3px] flex-middle">
                      <Icon
                        icon="ph:heart-fill"
                        className="cursor-pointer text-[36px] mobile:text-[28px] text-red-600"
                      />
                      <div className="md:text-[16px] text-white ml-[5px]">{bestImage.likeCount}</div>
                    </div>
                  </BasicImage>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Best;
