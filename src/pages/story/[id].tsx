import { useState } from "react";
import Image from "next/image";
import getDocument from "@/firebase/firestore/getDocument";
import { GetServerSidePropsContext } from "next";

interface StoryDetailProps {
  title: string;
  story: string;
  images: string[];
}

const StoryDetail = ({ title, story, images }: StoryDetailProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div>
      <div>
        <div>디테일</div>
        <figure>
          <Image
            src={images[currentIndex]}
            alt="detail-image"
            width={300}
            height={300}
            style={{ width: 300, height: 300 }}
          />
        </figure>
      </div>
      <div>
        <div>{title}</div>
        <div>{story}</div>
      </div>
    </div>
  );
};

export default StoryDetail;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const storyId = context.query.id as string;
  const result = await getDocument("stories", storyId);
  if (!result) return;

  return {
    props: { title: result.title, story: result.story, images: result.images },
  };
};
