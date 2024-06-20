import getCollection from "@/firebase/firestore/getCollection";
import getDocument from "@/firebase/firestore/getDocument";
import { useEffect, useState } from "react";

type BestLike = {
  imageId: string;
  imageUrl: string;
  likeCount: number;
  storyId: string;
  userId: string;
};

const Best = () => {
  const [bestLikes, setBestLikes] = useState<BestLike[]>([]);

  useEffect(() => {
    const getLikesData = async () => {
      const likeResult = await getCollection("likes-calc");
      if (!likeResult || likeResult.empty) return;

      const LikesData: BestLike[] = [];

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

      setBestLikes(getBestLikes(LikesData));
    };

    const getBestLikes = (likesData: BestLike[]) => {
      const newBestLikes: BestLike[] = [...likesData];

      newBestLikes.sort((a, b) => b.likeCount - a.likeCount);

      return newBestLikes.slice(0, 3);
    };

    getLikesData();
  }, []);

  return (
    <div>
      <div>
        <div>인기있는 사진들</div>
        {bestLikes.length === 0 ? <div>준비중입니다</div> : <div></div>}
      </div>
    </div>
  );
};

export default Best;
