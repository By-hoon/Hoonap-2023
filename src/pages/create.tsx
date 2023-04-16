import SaveImage from "@/components/create/SaveImage";
import SavePath from "@/components/create/SavePath";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

export default function Create() {
  const [part, setPart] = useState("image");
  const [path, setPath] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [images, setImage] = useState<FileList>();
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");

  const changeTitle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const changeStory = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setStory(e.target.value);
  }, []);

  const partRender = () => {
    switch (part) {
      case "path": {
        return <SavePath path={path} setPath={setPath} />;
      }
      case "image": {
        return (
          <SaveImage
            images={images}
            setImage={setImage}
            previewImages={previewImages}
            setPreviewImages={setPreviewImages}
          />
        );
      }
      case "story": {
        return (
          <div>
            <div>
              <input
                type="text"
                value={title}
                placeholder="게시물에게 제목을 지어주세요."
                onChange={changeTitle}
                required
              />
            </div>
            <div>
              <input
                type="text"
                value={story}
                placeholder="사진이 담고 있는 이야기를 들려주세요."
                onChange={changeStory}
                required
              />
            </div>
          </div>
        );
      }
    }
    return null;
  };

  return <div>{partRender()}</div>;
}
