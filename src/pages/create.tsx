import SaveImage from "@/components/create/SaveImage";
import SavePath from "@/components/create/SavePath";
import { useCallback, useState } from "react";
import Image from "next/image";
import Title from "@/components/common/Title";
import addData from "@/firebase/firestore/addData";
import addFile from "@/firebase/storage/addFile";
import deleteFile from "@/firebase/storage/deleteFile";
import setData from "@/firebase/firestore/setData";
import getUser from "@/firebase/auth/getUser";
import getDocument from "@/firebase/firestore/getDocument";
import { GetServerSidePropsContext } from "next/types";
import checkUser from "@/firebase/auth/checkUser";
import { useRouter } from "next/router";

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

  const changeStory = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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

  const createStory = async () => {
    if (paths.length === 0 || !images || title === "" || story === "") return;

    const fileUrls = await addFiles(images);

    if (!fileUrls) return;

    const storyId = crypto.randomUUID();

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
          <div>
            <div>
              {previewImages.map((imageUrl, index) => (
                <figure key={index}>
                  <Image
                    src={imageUrl}
                    alt="preview-image"
                    width={50}
                    height={50}
                    style={{ width: 50, height: 50 }}
                  />
                </figure>
              ))}
            </div>
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
                placeholder="사진들이 담고 있는 이야기를 들려주세요."
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

  return (
    <div>
      <Title title="스토리 생성" />
      <div>
        <div>
          <button onClick={() => changePart("path")}>위치</button>
          <button onClick={() => changePart("image")}>사진</button>
          <button onClick={() => changePart("story")}>스토리</button>
          <Title title="입력" />
        </div>
        <div>
          <button onClick={createStory}>생성</button>
        </div>
      </div>
      {partRender()}
      <div>
        <button onClick={goPreviousPart} disabled={part === "path" ? true : false}>
          이전
        </button>
        <button onClick={goNextPart} disabled={part === "story" ? true : false}>
          다음
        </button>
      </div>
    </div>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const uid = await checkUser(context);
  if (!uid) return { notFound: true };
  return {
    props: { uid },
  };
};
