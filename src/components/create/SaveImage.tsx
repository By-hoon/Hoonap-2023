import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";

interface SaveImageProps {
  images: FileList | undefined;
  setImage: Dispatch<SetStateAction<FileList | undefined>>;
}

const SaveImage = ({ images, setImage }: SaveImageProps) => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.currentTarget.files !== null) {
      const fileBlobs = e.currentTarget.files;
      setImage(fileBlobs);
    }
  };

  const encodeFileToBase64 = (fileBlobs: FileList) => {
    const filesArray = Array.from(fileBlobs).map((file) => URL.createObjectURL(file));
    setPreviewImages((prevImages) => prevImages.concat(filesArray));
  };

  useEffect(() => {
    if (images) {
      encodeFileToBase64(images);
    }
  }, [images]);

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={uploadImage} />
      {previewImages.map((imageUrl, index) => (
        <div key={index}>
          <Image
            src={imageUrl}
            alt="preview-image"
            width={150}
            height={150}
            style={{ width: 150, height: 150 }}
          />
        </div>
      ))}
    </div>
  );
};

export default SaveImage;
