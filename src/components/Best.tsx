import getCollection from "@/firebase/firestore/getCollection";
import getDocument from "@/firebase/firestore/getDocument";
import { useEffect, useState } from "react";
import BasicImage from "./common/BasicImage";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { IMAGE_GRADE } from "@/shared/constants";

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
        <div className="text-center">
          <div className="text-[28px] mobile:text-[22px] font-semibold mt-[20px] mb-[8px]">
            현재 인기있는 사진
          </div>
          <div className="flex-middle mb-[8px]">
            <Icon icon="radix-icons:divider-horizontal" />
          </div>
          <div className="text-[16px] break-keep mb-[20px]">
            현재까지 받은 좋아요의 개수로 집계된 순위입니다
          </div>
        </div>
        {bestImages.length === 0 ? (
          <div>준비중입니다</div>
        ) : (
          <div className="flex-middle flex-wrap">
            {bestImages.map((bestImage, index) => (
              <div
                key={bestImage.imageId}
                className="w-[220px] h-[360px] mobile:w-[200px] mobile:h-[200px] m-[5px]"
              >
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
                    <div className="absolute top-[3px] left-[5px] flex-middle">
                      <Icon icon="ph:heart-fill" className="text-[36px] mobile:text-[28px] text-red-600" />
                      <div className="md:text-[16px] text-white ml-[5px]">{bestImage.likeCount}</div>
                    </div>
                    <div className="absolute top-0 right-0 flex-middle">
                      <Icon icon={`${IMAGE_GRADE[index]}`} className="text-[42px] mobile:text-[32px]" />
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
