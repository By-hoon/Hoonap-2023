import SaveImage from "@/components/create/SaveImage";
import SavePath from "@/components/create/SavePath";
import { useCallback, useState } from "react";
import Image from "next/image";
import addFile from "@/firebase/storage/addFile";
import deleteFile from "@/firebase/storage/deleteFile";
import setData from "@/firebase/firestore/setData";
import getDocument from "@/firebase/firestore/getDocument";
import { GetServerSidePropsContext } from "next/types";
import checkUser from "@/firebase/auth/checkUser";
import { useRouter } from "next/router";
import Layout from "@/components/common/Layout";
import { Icon } from "@iconify/react";
import { isExp } from "@/utils/util";

export default function Create({ uid }: { uid: string }) {
  const [part, setPart] = useState("path");
  const [paths, setPaths] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [images, setImage] = useState<FileList>();
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");

  const router = useRouter();

  const changeTitle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const changeStory = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStory(e.target.value);
  }, []);

  const changePart = (newPart: string) => {
    if (newPart === "story") {
      if (previewImages.length === 0) {
        alert("스토리 작성은 이미지 입력 후 가능합니다.");
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

  const addFiles = async (files: FileList) => {
    const fileUrls: string[] = [];

    const imagesArr = [...Array.from(files)];

    for (let i = 0; i < imagesArr.length; i++) {
      const fileName = crypto.randomUUID();

      const result = await addFile(imagesArr[i], `story/${fileName}`);
      if (!result) {
        await deleteFiles(fileUrls);
        return false;
      }
      fileUrls.push(result);
    }
    return fileUrls;
  };

  const deleteFiles = async (fileUrls: string[]) => {
    for (let i = 0; i < fileUrls.length; i++) {
      await deleteFile(fileUrls[i]);
    }
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

  const createExpStory = (storyId: string) => {
    const storageStory = window.localStorage.getItem("story");

    const expDatas = storageStory ? [...JSON.parse(storageStory)] : [];

    if (expDatas.length >= 3) {
      alert("체험 계정은 3개까지만 스토리 등록이 가능합니다.");
      router.push("/story/list");
      return;
    }

    expDatas.push({
      paths,
      images: previewImages,
      title,
      story,
      userId: uid,
      storyId,
    });

    const expPaths: { paths: { latitude: number; longitude: number }[]; storyId: string }[] = [];
    const expImages: { [key: string]: string[] } = {};
    expDatas.forEach((expData) => {
      expPaths.push({
        paths: expData.paths,
        storyId: expData.storyId,
      });
      expImages[expData.storyId] = expData.images;
    });

    window.localStorage.setItem("story", JSON.stringify(expDatas));
    window.localStorage.setItem("paths", JSON.stringify(expPaths));
    window.localStorage.setItem("images", JSON.stringify(expImages));
    router.push("/story/list");
  };

  const createStory = async () => {
    if (paths.length === 0 || !images || title === "" || story === "") return;

    const storyId = crypto.randomUUID();

    if (isExp(uid)) {
      createExpStory(storyId);
      return;
    }

    const fileUrls = await addFiles(images);

    if (!fileUrls) return;

    const storyData = {
      paths,
      images: fileUrls,
      title,
      story,
      userId: uid,
    };

    const storyResult = await setData("stories", storyId, storyData);
    const pathResult = await setData("paths", storyId, { paths, userId: uid });
    const imageResult = await setData("images", storyId, { fileUrls, userId: uid });

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
        return <SavePath paths={paths} setPaths={setPaths} />;
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
          <div className="main-absolute">
            <div className="h-[60%] p-[20px] flex flex-wrap justify-between overflow-y-scroll scrollbar-hide">
              {previewImages.map((imageUrl, index) => (
                <figure
                  key={index}
                  className="relative w-[150px] h-[150px] rounded-[10px] border-2 my-[10px] p-[5px]"
                >
                  <Image
                    className="!relative object-contain"
                    src={imageUrl}
                    alt="preview-image"
                    sizes="(max-width: 768px) 50vw, 100vw"
                    fill
                  />
                </figure>
              ))}
            </div>
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
        );
      }
    }
    return null;
  };

  return (
    <Layout>
      <div className="p-[10px]">
        <div className="grid grid-cols-[minmax(420px,_5fr)_3fr]">
          <div className="main-relative">{partRender()}</div>
          <div className="p-[15px]">
            <div className="flex flex-wrap content-center p-[20px] pl-[40px] h-[90%]">
              <div className="flex w-[100%]">
                <div className="flex font-semibold text-[20px] my-[10px] pl-[10px] hover:text-bc">
                  <div className="flex items-center text-[28px] mr-[10px]">
                    <Icon icon="bx:map" />
                  </div>
                  <button onClick={() => changePart("path")}>위치</button>
                </div>
                {paths.length !== 0 ? (
                  <div className="flex items-center text-green-500 ml-[10px]">
                    <Icon icon="fluent-mdl2:completed-solid" />
                  </div>
                ) : null}
              </div>
              <div className="flex w-[100%]">
                <div className="flex font-semibold text-[20px] my-[10px] pl-[10px] hover:text-bc">
                  <div className="flex items-center text-[28px] mr-[10px]">
                    <Icon icon="icon-park-outline:add-pic" />
                  </div>
                  <button onClick={() => changePart("image")}>사진</button>
                </div>
                {images ? (
                  <div className="flex items-center text-green-500 ml-[10px]">
                    <Icon icon="fluent-mdl2:completed-solid" />
                  </div>
                ) : null}
              </div>
              <div className="flex w-[100%]">
                <div className="flex font-semibold text-[20px] my-[10px] pl-[10px] hover:text-bc">
                  <div className="flex items-center text-[28px] mr-[10px]">
                    <Icon icon="eos-icons:content-new" />
                  </div>
                  <button onClick={() => changePart("story")}>스토리</button>
                </div>
                {story !== "" && title !== "" ? (
                  <div className="flex items-center text-green-500 ml-[10px]">
                    <Icon icon="fluent-mdl2:completed-solid" />
                  </div>
                ) : null}
              </div>
              <div className="w-[100%] text-center mt-[45px]">
                <button
                  className="text-[19px] font-semibold bg-bc text-white px-[38px] py-[15px] rounded-[12px]"
                  onClick={createStory}
                >
                  스토리 생성
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="text-[20px] font-semibold text-center">
          <button className="mx-[10px]" onClick={goPreviousPart} disabled={part === "path" ? true : false}>
            이전
          </button>
          <button className="mx-[10px]" onClick={goNextPart} disabled={part === "story" ? true : false}>
            다음
          </button>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const uid = await checkUser(context);
  if (!uid) return { notFound: true };
  return {
    props: { uid },
  };
};
