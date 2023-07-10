import Layout from "@/components/common/Layout";
import getCollection from "@/firebase/firestore/getCollection";
import Image from "next/image";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Preview from "@/components/story/Preview";

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
      <div>
        <div>
          {images.map((imageObj, index) => (
            <figure key={index}>
              <Image
                src={imageObj.url}
                alt="preview-image"
                width={150}
                height={150}
                style={{ width: 150, height: 150 }}
                onClick={() => {
                  setCurrent(imageObj);
                }}
              />
            </figure>
          ))}
        </div>
        {current ? (
          <div className="border-2">
            <figure>
              <Image
                src={current.url}
                alt="preview-image"
                width={450}
                height={450}
                style={{ width: 450, height: 450 }}
              />
            </figure>
            <div>
              <Preview currentStoryId={current.id} userId={current.userId} />
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default Gallery;
