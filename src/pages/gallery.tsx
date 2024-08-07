import Layout from "@/components/common/Layout";
import getCollection from "@/firebase/firestore/getCollection";
import { useContext, useEffect, useRef, useState } from "react";
import { cardSizeCalculator, isExp } from "@/utils/util";
import { useAuth } from "@/context/authProvider";
import Router from "next/router";
import withHead from "@/components/hoc/withHead";
import { ALERT_TITLE, ALERT_CONTENT, HEAD_TITLE, HEAD_DESCRIPTION } from "@/shared/constants";
import { PopUpContext } from "@/context/popUpProvider";
import ImageCard from "@/components/gallery/ImageCard";
import CurrentImage from "@/components/gallery/CurrentImage";
import getDocument from "@/firebase/firestore/getDocument";

const Gallery = () => {
  const [curUserId, setCurUserId] = useState("");
  const [images, setImages] = useState<{ url: string; userId: string; id: string }[]>([]);
  const [likes, setLikes] = useState<{ [key: string]: boolean }>({});
  const [current, setCurrent] = useState<number>();

  const [cardSize, setCardSize] = useState(0);

  const sizeRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

  const { alert } = useContext(PopUpContext);

  useEffect(() => {
    if (!user) return;
    const userId = user.uid;

    setCurUserId(userId);

    const getImageData = async () => {
      const result = await getCollection("images");
      if (!result || result.empty) {
        alert(ALERT_TITLE.ACCESS, ALERT_CONTENT.NOTHING_STORY);
        Router.push("/");
        return;
      }

      const newData: { url: string; userId: string; id: string }[] = [];
      result.docs.forEach((doc) => {
        const curData = doc.data();
        newData.push({ url: curData.url, userId: curData.userId, id: curData.storyId });
      });

      setImages(newData);
    };

    const getExpImageData = async () => {
      const storageImage = window.localStorage.getItem("image");
      if (!storageImage) {
        alert(ALERT_TITLE.ACCESS, ALERT_CONTENT.NOTHING_STORY);
        Router.push("/");
        return;
      }

      const expImage = JSON.parse(storageImage);
      const imageObjects: { url: string; userId: string; id: string }[] = [];

      Object.keys(expImage).forEach((key) => {
        expImage[key].images.forEach((imageUrl: string) => {
          imageObjects.push({ url: imageUrl, userId, id: expImage[key].storyId });
        });
      });
      setImages(imageObjects);
    };

    const getLikeData = async () => {
      const result = await getDocument("likes", userId);
      if (!result || result.empty) return;

      const newLikes: { [key: string]: boolean } = {};
      Object.keys(result).forEach((imageId) => {
        newLikes[imageId] = true;
      });

      setLikes(newLikes);
    };

    if (isExp(userId)) {
      getExpImageData();
      return;
    }

    getImageData();
    getLikeData();
  }, [user, alert]);

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
  }, [images]);

  if (!user)
    return (
      <Layout>
        <div></div>
      </Layout>
    );

  return (
    <Layout>
      <div className="p-[10px]">
        <CurrentImage
          current={current}
          setCurrent={setCurrent}
          images={images}
          likes={likes}
          setLikes={setLikes}
          userId={curUserId}
        />
        <div ref={sizeRef} className={`flex flex-wrap items-center`}>
          {images.map((imageObj, index) => (
            <div
              key={index}
              className="mx-[5px]"
              onClick={() => {
                setCurrent(index);
              }}
            >
              <ImageCard url={imageObj.url} cardSize={cardSize} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default withHead(Gallery, HEAD_TITLE.GALLERY, HEAD_DESCRIPTION.GALLERY);
