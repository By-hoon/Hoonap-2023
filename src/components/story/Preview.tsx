import getDocument from "@/firebase/firestore/getDocument";
import { useEffect, useState } from "react";
import Image from "next/image";
import getUser from "@/firebase/auth/getUser";
import Link from "next/link";

interface PreviewProps {
  currentStoryId: string;
  userId: string;
}

const Preview = ({ currentStoryId, userId }: PreviewProps) => {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [user, setUser] = useState("");

  const getStory = async () => {
    const result = await getDocument("stories", currentStoryId);
    if (!result) return;
    setImages(result.images);
    setTitle(result.title);
    setStory(result.story);
  };
  const getUserData = async () => {
    const result = await getDocument("users", userId);
    if (!result) {
      setUser("unknown");
      return;
    }
    setUser(result.nickname);
  };
  useEffect(() => {
    getStory();
  }, [currentStoryId]);

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div>
      <Link
        href={{
          pathname: "/user/detail",
          query: { userId: userId },
        }}
        as="/user/detail"
      >
        {user}
      </Link>
      <div>
        <div>{title}</div>
        <div>{story}</div>
      </div>
      <div>
        {images.map((imageUrl, index) => (
          <figure key={index}>
            <Image
              src={imageUrl}
              alt="preview-image"
              width={150}
              height={150}
              style={{ width: 150, height: 150 }}
            />
          </figure>
        ))}
      </div>
      <div>
        <Link
          href={{
            pathname: "/story/detail",
            query: { storyId: currentStoryId },
          }}
          as="/story/detail"
        >
          자세히
        </Link>
      </div>
    </div>
  );
};

export default Preview;
