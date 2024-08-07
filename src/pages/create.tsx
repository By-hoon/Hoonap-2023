import SaveImage from "@/components/create/SaveImage";
import SavePath from "@/components/create/SavePath";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import setData from "@/firebase/firestore/setData";
import getDocument from "@/firebase/firestore/getDocument";
import { GetServerSidePropsContext } from "next/types";
import checkUser from "@/firebase/auth/checkUser";
import { useRouter } from "next/router";
import Layout from "@/components/common/Layout";
import { cardSizeCalculator, getImageId, isExp } from "@/utils/util";
import { addFiles } from "@/firebase/storage/add";
import { deleteFiles } from "@/firebase/storage/delete";
import Button from "@/components/common/Button";
import BasicImage from "@/components/common/BasicImage";
import PartButton from "@/components/create/PartButton";
import withHead from "@/components/hoc/withHead";
import {
  ALERT_CONTENT,
  ALERT_TITLE,
  CONFIRM_CONTENT,
  CONFIRM_TITLE,
  HEAD_DESCRIPTION,
  HEAD_TITLE,
} from "@/shared/constants";
import { PopUpContext } from "@/context/popUpProvider";

const Create = ({ uid }: { uid: string }) => {
  const [part, setPart] = useState("path");
  const [paths, setPaths] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [images, setImage] = useState<FileList>();
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [cardSize, setCardSize] = useState(0);

  const sizeRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const { alert, confirm } = useContext(PopUpContext);

  const changeTitle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const changeStory = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStory(e.target.value);
  }, []);

  const changePart = (newPart: string) => {
    if (newPart === "story") {
      if (previewImages.length === 0) {
        alert(ALERT_TITLE.ACCESS, ALERT_CONTENT.STORY_AFTER_IMAGE);
        return;
      }
    }
    setPart(newPart);
  };
  const goPreviousPart = () => {
    if (part === "image") changePart("path");
    if (part === "story") changePart("image");
  };
  const goNextPart = () => {
    if (part === "path") changePart("image");
    if (part === "image") changePart("story");
  };

  const getUserData = async (userId: string, storyId: string) => {
    const userData = await getDocument("users", userId);
    if (!userData) return { storyIds: [storyId] };
    if (userData.storyIds) return { storyIds: [...userData.storyIds, storyId] };
    return { storyIds: [storyId] };
  };

  const saveUser = async (storyId: string) => {
    const userData = await getUserData(uid, storyId);

    return await setData("users", uid, userData);
  };

  const createExpStory = async (storyId: string) => {
    const storageStory = window.localStorage.getItem("story");
    const storagePath = window.localStorage.getItem("path");
    const storageImage = window.localStorage.getItem("image");

    const expStory = storageStory ? JSON.parse(storageStory) : {};
    const expPath = storagePath ? JSON.parse(storagePath) : {};
    const expImage = storageImage ? JSON.parse(storageImage) : {};

    if (Object.keys(expStory).length >= 3) {
      alert(ALERT_TITLE.EXP, ALERT_CONTENT.EXP_CREATE);
      router.push("/story/list");
      return;
    }

    if (!images) return;
    const fileUrls = await addFiles(images, uid);

    expStory[storyId] = {
      paths,
      images: fileUrls,
      title,
      story,
      createdAt: Date.now(),
      userId: uid,
      storyId,
    };

    expPath[storyId] = {
      paths,
      storyId,
    };
    expImage[storyId] = {
      images: fileUrls,
      storyId,
    };

    window.localStorage.setItem("story", JSON.stringify(expStory));
    window.localStorage.setItem("path", JSON.stringify(expPath));
    window.localStorage.setItem("image", JSON.stringify(expImage));
    router.push("/story/list");
  };

  const clearAllInput = async () => {
    const result = await confirm(CONFIRM_TITLE.CLEAR_ALL_INPUT, CONFIRM_CONTENT.CLEAR_ALL_INPUT);
    if (!result) return;

    setPaths([]);
    setImage(undefined);
    setPreviewImages([]);
    setTitle("");
    setStory("");
  };

  const createStory = async () => {
    if (paths.length === 0 || !images?.length || title === "" || story === "") {
      alert(ALERT_TITLE.CREATE, ALERT_CONTENT.CHECK_ALL_INPUT);
      return;
    }

    const storyId = crypto.randomUUID();

    if (isExp(uid)) {
      createExpStory(storyId);
      return;
    }

    const fileUrls = await addFiles(images, uid);

    if (!fileUrls) return;

    const storyData = {
      paths,
      images: fileUrls,
      title,
      story,
      createdAt: Date.now(),
      userId: uid,
    };

    const storyResult = await setData("stories", storyId, storyData);
    const pathResult = await setData("paths", storyId, { paths, userId: uid });

    let imageResult = true;

    fileUrls.forEach(async (fileUrl) => {
      imageResult = await setData("images", getImageId(fileUrl), { url: fileUrl, userId: uid, storyId });
    });

    if (!storyResult || !pathResult || !imageResult) {
      await deleteFiles(fileUrls);
      return;
    }

    const userResult = await saveUser(storyId);
    // TODO: userResult false 시, 저장한 스토리들 삭제

    router.push("/story/list");
  };

  const partRender = () => {
    switch (part) {
      case "path": {
        return (
          <div className="main-relative">
            <SavePath paths={paths} setPaths={setPaths} />
          </div>
        );
      }
      case "image": {
        return (
          <div className="main-relative">
            <SaveImage
              images={images}
              setImage={setImage}
              previewImages={previewImages}
              setPreviewImages={setPreviewImages}
            />
          </div>
        );
      }
      case "story": {
        return (
          <div className="p-[10px]">
            <div
              ref={sizeRef}
              className="min-h-[360px] max-h-[438px] flex flex-wrap overflow-y-scroll scrollbar-hide"
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
                    alt={"uploaded-image"}
                  />
                </div>
              ))}
            </div>
            <div className="h-[280px]">
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
          </div>
        );
      }
    }
    return null;
  };

  useEffect(() => {
    if (part !== "story") return;

    const handleResize = () => {
      if (!sizeRef.current) return;
      const curWidth = sizeRef.current?.offsetWidth - 1;

      const curSize = cardSizeCalculator(curWidth);

      setCardSize(curSize);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [part]);

  return (
    <Layout>
      <div className="p-[10px]">
        <div className="md:grid md:grid-cols-[minmax(420px,_5fr)_3fr]">
          {partRender()}
          <div className="p-[15px]">
            <div className="flex flex-wrap content-center p-[20px] h-[90%]">
              <PartButton
                name={"위치"}
                icon={"bx:map"}
                isComplete={paths.length !== 0}
                onClick={() => changePart("path")}
              />
              <PartButton
                name={"사진"}
                icon={"icon-park-outline:add-pic"}
                isComplete={!!images && images?.length !== 0}
                onClick={() => changePart("image")}
              />
              <PartButton
                name={"스토리"}
                icon={"eos-icons:content-new"}
                isComplete={story !== "" && title !== ""}
                onClick={() => changePart("story")}
              />
              {paths.length !== 0 || images?.length || title !== "" || story !== "" ? (
                <div className="w-full text-center mt-[10px]">
                  <Button
                    text="초기화"
                    style="text-[16px] font-semibold bg-red-400 text-white px-[18px] py-[8px] rounded-[20px]"
                    onClick={clearAllInput}
                  />
                </div>
              ) : null}

              <div
                className={`w-[100%] text-center ${
                  paths.length !== 0 || images?.length || title !== "" || story !== ""
                    ? "mt-[10px]"
                    : "mt-[60px]"
                }`}
              >
                <Button
                  text="스토리 생성"
                  style="text-[19px] font-semibold bg-bc text-white px-[38px] py-[15px] rounded-[30px]"
                  onClick={createStory}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="text-[20px] font-semibold text-center">
          <Button
            text="이전"
            style="mx-[10px]"
            onClick={goPreviousPart}
            disabled={part === "path" ? true : false}
          />
          <Button
            text="다음"
            style="mx-[10px]"
            onClick={goNextPart}
            disabled={part === "story" ? true : false}
          />
        </div>
      </div>
    </Layout>
  );
};

export default withHead(Create, HEAD_TITLE.CREATE, HEAD_DESCRIPTION.CREATE);

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const uid = await checkUser(context);
  if (!uid) return { notFound: true };
  return {
    props: { uid },
  };
};
