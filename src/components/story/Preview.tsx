import getDocument from "@/firebase/firestore/getDocument";
import { useEffect, useState } from "react";
import Image from "next/image";
import getUser from "@/firebase/auth/getUser";

interface PreviewProps {
  currentStoryId: string;
}

const Preview = ({ currentStoryId }: PreviewProps) => {
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
  const getUserData = () => {
    const userData = getUser();
    console.log(userData);
    if (!userData) return;
    setUser(userData.email ? userData.email : "unknown");
  };
  useEffect(() => {
    getStory();
  }, [currentStoryId]);

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div>
      <div>{user}</div>
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
    </div>
  );
};

export default Preview;
