import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import BasicImage from "../common/BasicImage";
import { cardSizeCalculator } from "@/utils/util";

interface SaveImageProps {
  images: FileList | undefined;
  setImage: Dispatch<SetStateAction<FileList | undefined>>;
  previewImages: string[];
  setPreviewImages: Dispatch<SetStateAction<string[]>>;
}

const SaveImage = ({ images, setImage, previewImages, setPreviewImages }: SaveImageProps) => {
  const [cardSize, setCardSize] = useState(0);

  const sizeRef = useRef<HTMLDivElement>(null);

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.currentTarget.files === null) return;

    const fileBlobs = e.currentTarget.files;

    encodeFileToBase64(fileBlobs);

    if (images === undefined || images.length === 0) {
      setImage(fileBlobs);
      return;
    }
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

  useEffect(() => {
    const handleResize = () => {
      if (!sizeRef.current) return;
      const curWidth = sizeRef.current?.offsetWidth - 1;

      const curSize = cardSizeCalculator(curWidth);

      setCardSize(curSize);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="main-absolute">
      <div
        ref={sizeRef}
        className="md:h-[85%] mobile:h-[80%] flex flex-wrap overflow-y-scroll scrollbar-hide"
      >
        {previewImages.map((imageUrl, index) => (
          <div
            key={index}
            className="mx-[5px] mb-[10px]"
            style={{
              width: `${cardSize}px`,
              height: `${cardSize}px`,
            }}
          >
            <BasicImage
              style={"relative w-full h-full rounded-[10px] bg-black overflow-hidden"}
              url={imageUrl}
              alt={"upload-image"}
            >
              <div
                className="absolute top-0 left-0 flex-middle w-[100%] h-[100%] rounded-[10px] cursor-pointer"
                onClick={() => deleteImage(index)}
              >
                <Icon icon="ant-design:delete-filled" className="text-[30px] text-white" />
              </div>
            </BasicImage>
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="preview">
          <div className="flex-middle w-[130px] h-[50px] mx-auto mobile:mt-[10px] md:mt-[30px] bg-bc text-white text-[18px] font-semibold rounded-[10px] cursor-pointer">
            사진 업로드
          </div>
        </label>
        <input id="preview" className="hidden" type="file" accept="image/*" multiple onChange={uploadImage} />
      </div>
    </div>
  );
};

export default SaveImage;
