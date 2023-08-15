import Layout from "@/components/common/Layout";
import SaveImage from "@/components/create/SaveImage";
import SavePath from "@/components/create/SavePath";
import updateField from "@/firebase/firestore/updateField";
import { addFiles } from "@/firebase/storage/add";
import { isExp } from "@/utils/util";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { storyProps } from "./detail";
import { deleteFile } from "@/firebase/storage/delete";

const StoryEdit = () => {
  const router = useRouter();

  const {
    title: queryTitle,
    story: queryStory,
    images: queryImageUrls,
    paths: queryPaths,
    userId,
    storyId,
    restExpStory: queryRestExpStory,
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

  const ediEtxpStory = (imageData: string[]) => {
    const curStoryId = storyId as string;
    const curUserId = userId as string;

    const newExpStory: { [key: string]: storyProps } = {};
    const newExpPaths: {
      [key: string]: { paths: { latitude: number; longitude: number }[]; storyId: string };
    } = {};
    const newExpImages: { [key: string]: { images: string[]; storyId: string } } = {};

    newExpStory[curStoryId] = {
      title,
      story,
      paths,
      images: imageData,
      storyId: curStoryId,
      userId: curUserId,
    };
    newExpPaths[curStoryId] = {
      paths,
      storyId: curStoryId,
    };
    newExpImages[curStoryId] = {
      images: imageData,
      storyId: curStoryId,
    };

    const restExpStory = JSON.parse(queryRestExpStory as string);

    const restExpStories = Object.keys(restExpStory);

    if (restExpStories.length !== 0) {
      restExpStories.forEach((key) => {
        newExpStory[key] = {
          title: restExpStory[key].title,
          story: restExpStory[key].story,
          paths: restExpStory[key].paths,
          images: restExpStory[key].images,
          storyId: restExpStory[key].storyId,
          userId: restExpStory[key].userId,
        };
        newExpPaths[key] = {
          paths: restExpStory[key].paths,
          storyId: restExpStory[key].storyId,
        };
        newExpImages[key] = {
          images: restExpStory[key].images,
          storyId: restExpStory[key].storyId,
        };
      });
    }

    window.localStorage.setItem("story", JSON.stringify(newExpStory));
    window.localStorage.setItem("path", JSON.stringify(newExpPaths));
    window.localStorage.setItem("image", JSON.stringify(newExpImages));
  };

  const editStory = async () => {
    if (paths.length === 0 || !previewImages || title === "" || story === "") return;

    const curStoryId = storyId as string;
    const curUserId = userId as string;
    const imageData: string[] = [];

    for (let i = 0; i < oldImages.length; i++) {
      let isDelete = true;
      for (let j = 0; j < oldImages.length; j++) {
        if (oldImages[i] === previewImages[j]) {
          imageData.push(oldImages[i]);
          isDelete = false;
          break;
        }
      }
      if (isDelete) deleteFile(oldImages[i]);
    }

    if (images) {
      const fileUrls = await addFiles(images, curUserId);
      if (!fileUrls) return;

      fileUrls.forEach((url) => {
        imageData.push(url);
      });
    }

    if (isExp(curUserId)) {
      ediEtxpStory(imageData);
    } else {
      await updateField("paths", curStoryId, "paths", paths);
      await updateField("images", curStoryId, "fileUrls", imageData);
      await updateField("stories", curStoryId, "paths", paths);
      await updateField("stories", curStoryId, "images", imageData);
      await updateField("stories", curStoryId, "title", title);
      await updateField("stories", curStoryId, "story", story);
    }

    router.push("/story/list");
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
