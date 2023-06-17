import { useEffect, useState } from "react";
import Image from "next/image";
import getDocument from "@/firebase/firestore/getDocument";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import Layout from "@/components/common/Layout";

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
      <div>
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
      <div>
        <figure>
          <Image
            src={images[currentIndex]}
            alt="detail-image"
            width={300}
            height={300}
            style={{ width: 300, height: 300 }}
          />
          <div className="flex">
            <figcaption onClick={preImage}>이전</figcaption>
            <figcaption onClick={nextImage}>다음</figcaption>
          </div>
        </figure>
      </div>
      <div>
        <div>{title}</div>
        <div>{story}</div>
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
