import Layout from "@/components/common/Layout";
import SaveImage from "@/components/create/SaveImage";
import SavePath from "@/components/create/SavePath";
import updateField from "@/firebase/firestore/updateField";
import { addFiles } from "@/firebase/storage/add";
import { isExp } from "@/utils/util";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

const StoryEdit = () => {
  const router = useRouter();

  const {
    title: queryTitle,
    story: queryStory,
    images: queryImageUrls,
    paths: queryPaths,
    userId,
    storyId,
  } = router.query;

  const [paths, setPaths] = useState<{ latitude: number; longitude: number }[]>([]);
  const [images, setImage] = useState<FileList>();
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [oldImages, setOldImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");

  const changeTitle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const changeStory = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStory(e.target.value);
  }, []);

  const editStory = async () => {
    const curStoryId = storyId as string;
    const curUserId = userId as string;
    const imageData = [...oldImages];

    if (images) {
      const fileUrls = await addFiles(images, curUserId);
      if (!fileUrls) return;

      fileUrls.forEach((url) => {
        imageData.push(url);
      });
    }

    if (isExp(curUserId)) {
      console.log("exp");
    } else {
      await updateField("paths", curStoryId, "paths", paths);
      await updateField("images", curStoryId, "fileUrls", imageData);
      await updateField("stories", curStoryId, "paths", paths);
      await updateField("stories", curStoryId, "images", imageData);
      await updateField("stories", curStoryId, "title", title);
      await updateField("stories", curStoryId, "story", story);
    }
  };

  useEffect(() => {
    setPaths(JSON.parse(queryPaths as string));
    setTitle(queryTitle as string);
    setStory(queryStory as string);

    const stringImages = queryImageUrls as string[];
    const newQueryImageUrls = typeof stringImages === "string" ? [stringImages] : stringImages;
    setPreviewImages(newQueryImageUrls);
    setOldImages(newQueryImageUrls);
  }, []);

  return (
    <Layout>
      <div className="md:w-[670px] mx-auto p-[10px]">
        <div className="main-relative border-b-2">
          <SavePath paths={paths} setPaths={setPaths} />
        </div>
        <div className="main-relative border-b-2">
          <SaveImage
            images={images}
            setImage={setImage}
            previewImages={previewImages}
            setPreviewImages={setPreviewImages}
          />
        </div>
        <div className="main-relative border-b-2">
          <div className="main-absolute">
            <div className="min-w-[420px] max-w-[550px] h-[40%] mx-auto my-0 p-[10px] flex flex-wrap content-between">
              <div className="w-[100%] border-2 border-bc p-[10px] rounded-[15px]">
                <input
                  className="w-[100%] focus:outline-none"
                  type="text"
                  value={title}
                  placeholder="게시물에게 제목을 지어주세요."
                  onChange={changeTitle}
                  required
                />
              </div>
              <div className="w-[100%] h-[70%] border-2 border-bc p-[10px] rounded-[15px]">
                <textarea
                  className="w-[100%] !h-[100%] focus:outline-none resize-none"
                  value={story}
                  placeholder="사진들이 담고 있는 이야기를 들려주세요."
                  onChange={changeStory}
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-[100%] text-center mt-[45px]">
          <button
            className="text-[19px] font-semibold bg-bc text-white px-[38px] py-[15px] rounded-[12px]"
            onClick={editStory}
          >
            스토리 수정
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default StoryEdit;
