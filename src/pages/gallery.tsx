import Layout from "@/components/common/Layout";
import getCollection from "@/firebase/firestore/getCollection";
import { useContext, useEffect, useState } from "react";
import { isExp } from "@/utils/util";
import { useAuth } from "@/context/authProvider";
import BasicImage from "@/components/common/BasicImage";
import Router from "next/router";
import Link from "next/link";
import withHead from "@/components/hoc/withHead";
import { alertContent, alertTitle, headDescription, headTitle } from "@/shared/constants";
import { PopUpContext } from "@/context/popUpProvider";
import ImageCard from "@/components/gallery/ImageCard";

const Gallery = () => {
  const [images, setImages] = useState<{ url: string; userId: string; id: string }[]>([]);
  const [current, setCurrent] = useState<{ url: string; userId: string; id: string }>();

  const { user } = useAuth();

  const { alert } = useContext(PopUpContext);

  useEffect(() => {
    if (!user) return;
    const userId = user.uid;

    const getImageData = async () => {
      const result = await getCollection("images");
      if (!result || result.empty) {
        alert(alertTitle.access, alertContent.nothingStory);
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
        alert(alertTitle.access, alertContent.nothingStory);
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
                  <div className="absolute bottom-0 left-0 w-full h-[80px] mobile:h-[60px] flex-middle bg-black bg-opacity-30">
                    <Link
                      className="w-[210px] h-[50px] text-white text-[24px] text-center mobile:w-[180px] mobile:h-[40px] mobile:text-[20px] border rounded-[10px] px-[10px] py-[5px]"
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
        <div className={`flex flex-wrap justify-between items-center px-[15px]`}>
          {images.map((imageObj, index) => (
            <div
              key={index}
              onClick={() => {
                setCurrent(imageObj);
              }}
            >
              <ImageCard url={imageObj.url} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default withHead(Gallery, headTitle.gallery, headDescription.gallery);
