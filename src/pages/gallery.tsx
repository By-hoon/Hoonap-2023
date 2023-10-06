import Layout from "@/components/common/Layout";
import getCollection from "@/firebase/firestore/getCollection";
import Image from "next/image";
import { useEffect, useState } from "react";
import Preview from "@/components/story/Preview";
import { Icon } from "@iconify/react";
import { isExp } from "@/utils/util";
import { useAuth } from "@/context/authProvider";
import BasicImage from "@/components/common/BasicImage";
import Router from "next/router";

const Gallery = () => {
  const [images, setImages] = useState<{ url: string; userId: string; id: string }[]>([]);
  const [current, setCurrent] = useState<{ url: string; userId: string; id: string }>();

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const userId = user.uid;

    const getImageData = async () => {
      const result = await getCollection("images");
      if (!result) {
        alert("게시된 스토리가 없습니다.");
        Router.push("/");
        return;
      }

      const newData: { url: string; userId: string; id: string }[] = [];
      result.docs.forEach((doc) => {
        const userId = doc.data().userId;
        doc.data().fileUrls.forEach((url: string) => {
          newData.push({ url, userId, id: doc.id });
        });
      });
      setImages(newData);
    };

    const getExpImageData = () => {
      const storageImage = window.localStorage.getItem("image");
      if (!storageImage) {
        alert("게시된 스토리가 없습니다.");
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

    if (isExp(userId)) {
      getExpImageData();
      return;
    }
    getImageData();
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
        {current ? (
          <div className="relative md:grid md:grid-cols-[minmax(420px,_1fr)_1fr]">
            <div className="absolute top-0 right-0 z-10">
              <Icon
                icon="ep:close-bold"
                onClick={() => {
                  setCurrent(undefined);
                }}
              />
            </div>
            <div className="main-relative">
              <BasicImage style={"main-absolute"} url={current.url} alt={"gallery-current-image"} />
            </div>
            <div className="flex items-center p-[15px]">
              <Preview currentStoryId={current.id} userId={current.userId} />
            </div>
          </div>
        ) : null}
        <div
          className={`flex flex-wrap items-center p-[15px]
          ${current ? "h-[200px] overflow-y-scroll scrollbar-hide" : ""}`}
        >
          {images.map((imageObj, index) => (
            <div
              key={index}
              onClick={() => {
                setCurrent(imageObj);
              }}
            >
              <BasicImage
                style={
                  "relative md:w-[150px] md:h-[150px] w-[140px] h-[140px] mx-[10px] rounded-[8px] overflow-hidden"
                }
                url={imageObj.url}
                alt={"gallery-image"}
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Gallery;
