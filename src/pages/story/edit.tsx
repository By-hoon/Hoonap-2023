import Layout from "@/components/common/Layout";
import SaveImage from "@/components/create/SaveImage";
import SavePath from "@/components/create/SavePath";
import updateField from "@/firebase/firestore/updateField";
import { addFiles } from "@/firebase/storage/add";
import { isExp } from "@/utils/util";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { StoryProps } from "./detail";
import { deleteFile } from "@/firebase/storage/delete";
import Button from "@/components/common/Button";
import { PopUpContext } from "@/context/popUpProvider";
import {
  alertContent,
  alertTitle,
  confirmContent,
  confirmTitle,
  headDescription,
  headTitle,
} from "@/shared/constants";
import withHead from "@/components/hoc/withHead";

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

  const { alert, confirm } = useContext(PopUpContext);

  const changeTitle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const changeStory = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStory(e.target.value);
  }, []);

  const editExpStory = (imageData: string[]) => {
    const storageStories = window.localStorage.getItem("story");
    const storagePaths = window.localStorage.getItem("path");
    const storageImages = window.localStorage.getItem("image");
    if (!storageStories || !storagePaths || !storageImages) return;

    const expStories: { [key: string]: StoryProps } = JSON.parse(storageStories);
    const expPaths: { [key: string]: { paths: { latitude: number; longitude: number }[]; storyId: string } } =
      JSON.parse(storagePaths);
    const expImages: { [key: string]: { images: string[]; storyId: string } } = JSON.parse(storageImages);

    const curStoryId = storyId as string;
    const curUserId = userId as string;

    expStories[curStoryId] = {
      title,
      story,
      paths,
      images: imageData,
      createdAt: expStories[curStoryId].createdAt,
      storyId: curStoryId,
      userId: curUserId,
    };

    expPaths[curStoryId] = {
      paths,
      storyId: curStoryId,
    };
    expImages[curStoryId] = {
      images: imageData,
      storyId: curStoryId,
    };

    window.localStorage.setItem("story", JSON.stringify(expStories));
    window.localStorage.setItem("path", JSON.stringify(expPaths));
    window.localStorage.setItem("image", JSON.stringify(expImages));
  };

  const editStory = async () => {
    if (paths.length === 0 || !previewImages || title === "" || story === "") return;

    const result = await confirm(confirmTitle.editStory, confirmContent.editStory);
    if (!result) return;

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
      editExpStory(imageData);
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
    if (!queryPaths || !queryTitle || !queryStory || !queryImageUrls) {
      alert(alertTitle.access, alertContent.nothingStory);
      router.push("/");
      return;
    }

    setPaths(JSON.parse(queryPaths as string));
    setTitle(queryTitle as string);
    setStory(queryStory as string);

    const stringImages = queryImageUrls as string[];
    const newQueryImageUrls = typeof stringImages === "string" ? [stringImages] : stringImages;
    setPreviewImages(newQueryImageUrls);
    setOldImages(newQueryImageUrls);
  }, [alert, queryImageUrls, queryPaths, queryStory, queryTitle, router]);

  if (!queryImageUrls)
    return (
      <Layout>
        <div></div>
      </Layout>
    );

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
        <div className="h-[280px] border-b-2">
          <div className="md:min-w-[420px] md:max-w-[550px] h-full mx-auto my-0 p-[10px] flex flex-wrap content-between">
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
        <div className="w-[100%] text-center mt-[45px]">
          <Button
            text="스토리 수정"
            style="text-[19px] font-semibold bg-bc text-white px-[38px] py-[15px] rounded-[12px]"
            onClick={editStory}
          />
        </div>
      </div>
    </Layout>
  );
};

export default withHead(StoryEdit, headTitle.storyEdit, headDescription.storyEdit);
