import Layout from "@/components/common/Layout";
import getCollection from "@/firebase/firestore/getCollection";
import { useEffect, useState } from "react";
import { isExp } from "@/utils/util";
import { useAuth } from "@/context/authProvider";
import BasicImage from "@/components/common/BasicImage";
import Router from "next/router";
import Link from "next/link";

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
                url={current.url}
                alt={"current-image"}
              >
                <div>
                  <div
                    className="w-[210px] h-[50px] flex-middle text-white text-[24px] border rounded-[10px] mx-auto mt-[10px]
                    mobile:w-[180px] mobile:h-[45px] mobile:text-[20px]"
                  >
                    <Link
                      href={{
                        pathname: "/story/detail",
                        query: { storyId: current.id },
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
        <div className={`flex flex-wrap items-center p-[15px]`}>
          {images.map((imageObj, index) => (
            <div
              key={index}
              onClick={() => {
                setCurrent(imageObj);
              }}
            >
              <BasicImage
                style={"relative md:w-[150px] md:h-[150px] w-[140px] h-[140px] mx-[10px] rounded-[8px]"}
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
