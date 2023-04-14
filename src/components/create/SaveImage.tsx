import { ChangeEvent, useState } from "react";
import Image from "next/image";

const SaveImage = () => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.currentTarget.files !== null) {
      const fileBlobs = e.currentTarget.files;
      encodeFileToBase64(fileBlobs);
    }
  };

  const encodeFileToBase64 = (fileBlobs: FileList) => {
    const filesArray = Array.from(fileBlobs).map((file) => URL.createObjectURL(file));
    setPreviewImages((prevImages) => prevImages.concat(filesArray));
  };

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={uploadImage} />
      {previewImages.map((imageUrl, index) => (
        <div key={index}>
          <Image src={imageUrl} alt="preview-image" width={150} height={150} />
        </div>
      ))}
    </div>
  );
};

export default SaveImage;
