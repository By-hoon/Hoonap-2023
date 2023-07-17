import { useEffect, useState } from "react";
import Image from "next/image";
import getDocument from "@/firebase/firestore/getDocument";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import Layout from "@/components/common/Layout";
import { Icon } from "@iconify/react";

interface StoryDetailProps {
  title: string;
  story: string;
  images: string[];
  userId: string;
}

const StoryDetail = ({ title, story, images, userId }: StoryDetailProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { nickname } = useUser(userId);

  const preImage = () => {
    if (currentIndex === 0) {
      setCurrentIndex(images.length - 1);
      return;
    }
    setCurrentIndex((c) => c - 1);
  };
  const nextImage = () => {
    if (currentIndex === images.length - 1) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((c) => c + 1);
  };

  return (
    <Layout>
      <div className="md:grid md:grid-cols-[1fr_300px] min-w-[300px] max-w-[964px] md:mt-[95px] md:mx-[30px] lg:mx-auto border rounded-[5px] overflow-hidden">
        <div className="main-relative">
          <figure className="main-absolute p-0 bg-black">
            <Image
              src={images[currentIndex]}
              alt="detail-image"
              className="w-full h-full !relative object-contain"
              fill
            />
            <div className="flex justify-between w-full absolute top-[50%] left-[0] translate-y-[-50%] text-[28px] text-white opacity-60 px-[10px]">
              <figcaption className="cursor-pointer" onClick={preImage}>
                <Icon icon="icon-park-solid:left-c" />
              </figcaption>
              <figcaption className="cursor-pointer" onClick={nextImage}>
                <Icon icon="icon-park-solid:right-c" />
              </figcaption>
            </div>
            <div className="absolute bottom-[10px] left-0 w-full z-20 flex justify-center">
              {images.map((image, index) => (
                <div
                  key={image}
                  className={`w-[8px] h-[8px] bg-white rounded-[50%] mx-[2px]
                  ${currentIndex === index ? "opacity-100" : "opacity-40"}`}
                />
              ))}
            </div>
          </figure>
        </div>
        <div>
          <div className="h-[60px] border-b-2 mb-[10px] px-[15px]">
            <div className="h-full flex items-center text-[18px]">
              <Link
                href={{
                  pathname: "/user/detail",
                  query: { userId: userId },
                }}
                as="/user/detail"
              >
                {nickname}
              </Link>
            </div>
          </div>
          <div className="px-[15px]">
            <div className="h-[40px] text-[22px]">{title}</div>
            <div className="text-[18px] mt-[5px]">{story}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StoryDetail;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const storyId = context.query.storyId as string;
  const result = await getDocument("stories", storyId);
  if (!result) return { notFound: true };

  return {
    props: { title: result.title, story: result.story, images: result.images, userId: result.userId },
  };
};
