import Layout from "@/components/common/Layout";
import getCollection from "@/firebase/firestore/getCollection";
import Image from "next/image";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Gallery = () => {
  const [images, setImages] = useState<{ url: string; id: string }[]>([]);
  const router = useRouter();

  const getImageData = async () => {
    const result = await getCollection("images");
    if (!result) return;

    const newData: { url: string; id: string }[] = [];
    result.docs.forEach((doc) => {
      doc.data().fileUrls.forEach((url: string) => {
        newData.push({ url, id: doc.id });
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
        {images.map((imageObj, index) => (
          <figure key={index}>
            <Image
              src={imageObj.url}
              alt="preview-image"
              width={150}
              height={150}
              style={{ width: 150, height: 150 }}
            />
          </figure>
        ))}
      </div>
    </Layout>
  );
};

export default Gallery;
