import Layout from "@/components/common/Layout";
import getCollection from "@/firebase/firestore/getCollection";
import { useContext, useEffect, useState } from "react";
import { isExp } from "@/utils/util";
import { useAuth } from "@/context/authProvider";
import BasicImage from "@/components/common/BasicImage";
import Router from "next/router";
import Link from "next/link";
import withHead from "@/components/hoc/withHead";
import {
  GALLERY_CARD_MARGIN_X,
  GALLERY_PADDING,
  MAX_CONTENT_WIDTH,
  alertContent,
  alertTitle,
  headDescription,
  headTitle,
} from "@/shared/constants";
import { PopUpContext } from "@/context/popUpProvider";
import ImageCard from "@/components/gallery/ImageCard";

const Gallery = () => {
  const [images, setImages] = useState<{ url: string; userId: string; id: string }[]>([]);
  const [current, setCurrent] = useState<{ url: string; userId: string; id: string }>();

  const [cardSize, setCardSize] = useState(0);
  const cardMarginX = `mx-[${GALLERY_CARD_MARGIN_X}px]`;
  const padding = `p-[${GALLERY_PADDING}px]`;

  const { user } = useAuth();

  const { alert } = useContext(PopUpContext);

  useEffect(() => {
    if (!user) return;
    const userId = user.uid;

    const getImageData = async () => {
      const result = await getCollection("images");
      if (!result || result.empty) {
        await alert(alertTitle.access, alertContent.nothingStory);
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

    const getExpImageData = async () => {
      const storageImage = window.localStorage.getItem("image");
      if (!storageImage) {
        await alert(alertTitle.access, alertContent.nothingStory);
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
  }, [user, alert]);

  useEffect(() => {
    const cardColumn = (curWidth: number) => {
      if (curWidth > 990) return 6;
      if (curWidth <= 990 && curWidth > 700) return 5;
      if (curWidth <= 700 && curWidth > 450) return 4;
      if (curWidth <= 450 && curWidth > 300) return 3;
      return 2;
    };

    const cardSizeCalculator = (curWidth: number) => {
      return Math.floor(curWidth / cardColumn(curWidth)) - GALLERY_CARD_MARGIN_X * 2;
    };

    const handleResize = () => {
      const curWidth = window.innerWidth;

      const curSize = cardSizeCalculator(
        curWidth > MAX_CONTENT_WIDTH
          ? MAX_CONTENT_WIDTH - GALLERY_PADDING * 2
          : curWidth - GALLERY_PADDING * 2
      );

      setCardSize(curSize);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!user)
    return (
      <Layout>
        <div></div>
      </Layout>
    );

  return (
    <Layout>
      <div className={`${padding}`}>
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
        <div className={`flex flex-wrap items-center`}>
          {images.map((imageObj, index) => (
            <div
              key={index}
              className={`${cardMarginX}`}
              onClick={() => {
                setCurrent(imageObj);
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

export default withHead(Gallery, headTitle.gallery, headDescription.gallery);
