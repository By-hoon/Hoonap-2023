import Layout from "@/components/common/Layout";
import getCollection from "@/firebase/firestore/getCollection";
import Image from "next/image";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Preview from "@/components/story/Preview";
import { Icon } from "@iconify/react";

const Gallery = () => {
  const [images, setImages] = useState<{ url: string; userId: string; id: string }[]>([]);
  const [current, setCurrent] = useState<{ url: string; userId: string; id: string }>();

  const router = useRouter();

  const getImageData = async () => {
    const result = await getCollection("images");
    if (!result) return;

    const newData: { url: string; userId: string; id: string }[] = [];
    result.docs.forEach((doc) => {
      const userId = doc.data().userId;
      doc.data().fileUrls.forEach((url: string) => {
        newData.push({ url, userId, id: doc.id });
      });
    });
    setImages(newData);
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      getImageData();
    });
  }, []);

  return (
    <Layout>
      <div className="p-[10px]">
        {current ? (
          <div className="relative grid grid-cols-[minmax(420px,_1fr)_1fr]">
            <div className="absolute top-0 right-0">
              <Icon
                icon="ep:close-bold"
                onClick={() => {
                  setCurrent(undefined);
                }}
              />
            </div>
            <div className="main-relative">
              <figure className="main-absolute">
                <Image
                  src={current.url}
                  alt="preview-image"
                  className="w-full h-full !relative object-contain"
                  fill
                />
              </figure>
            </div>
            <div className="flex items-center p-[15px]">
              <Preview currentStoryId={current.id} userId={current.userId} />
            </div>
          </div>
        ) : null}
        <div
          className={`flex items-center p-[15px] 
          ${current ? "h-[200px] overflow-y-scroll scrollbar-hide" : ""}`}
        >
          {images.map((imageObj, index) => (
            <figure className="w-[150px] h-[150px] mx-[10px] rounded-[8px] overflow-hidden" key={index}>
              <Image
                src={imageObj.url}
                alt="preview-image"
                className="w-full h-full !relative object-contain"
                fill
                onClick={() => {
                  setCurrent(imageObj);
                }}
              />
            </figure>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Gallery;
