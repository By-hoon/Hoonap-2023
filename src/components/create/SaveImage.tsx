import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";

interface SaveImageProps {
  images: FileList | undefined;
  setImage: Dispatch<SetStateAction<FileList | undefined>>;
  previewImages: string[];
  setPreviewImages: Dispatch<SetStateAction<string[]>>;
}

const SaveImage = ({ images, setImage, previewImages, setPreviewImages }: SaveImageProps) => {
  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.currentTarget.files === null) return;

    const fileBlobs = e.currentTarget.files;

    encodeFileToBase64(fileBlobs);

    if (images === undefined || images.length === 0) {
      setImage(fileBlobs);
      return;
    }
    console.log("run");
    const dataTranster = new DataTransfer();
    const newImages = [...Array.from(images), ...Array.from(fileBlobs)];

    newImages.forEach((file) => {
      dataTranster.items.add(file);
    });

    setImage(dataTranster.files);
  };

  const deleteImage = (index: number) => {
    const newPreviewImages = [...previewImages];
    newPreviewImages.splice(index, 1);
    setPreviewImages(newPreviewImages);

    const dataTranster = new DataTransfer();
    if (images)
      Array.from(images).forEach((file, fileIndex) => {
        if (fileIndex === index) return;
        dataTranster.items.add(file);
      });

    setImage(dataTranster.files);
  };

  const encodeFileToBase64 = (fileBlobs: FileList) => {
    const filesArray = Array.from(fileBlobs).map((file) => URL.createObjectURL(file));
    setPreviewImages((prevImages) => prevImages.concat(filesArray));
  };

  return (
    <div className="main-absolute">
      <div className="h-[85%] p-[20px] flex flex-wrap justify-between overflow-y-scroll scrollbar-hide">
        {previewImages.map((imageUrl, index) => (
          <figure
            key={index}
            className="relative w-[200px] h-[200px] rounded-[10px] border-2 my-[10px] p-[5px]"
          >
            <Image
              className="!relative object-contain"
              src={imageUrl}
              alt="preview-image"
              sizes="(max-width: 768px) 50vw, 100vw"
              fill
            />
            <div
              className="absolute top-0 left-0 flex justify-center items-center w-[100%] h-[100%] rounded-[10px] cursor-pointer"
              onClick={() => deleteImage(index)}
            >
              <Icon icon="ant-design:delete-filled" className="text-[30px] text-white" />
            </div>
          </figure>
        ))}
      </div>
      <div>
        <label htmlFor="preview">
          <div className="flex justify-center items-center w-[130px] h-[50px] mx-auto my-[20px] bg-bc text-white text-[18px] font-semibold rounded-[10px] cursor-pointer">
            사진 업로드
          </div>
        </label>
        <input id="preview" className="hidden" type="file" accept="image/*" multiple onChange={uploadImage} />
      </div>
    </div>
  );
};

export default SaveImage;
