import { isExp } from "@/utils/util";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { deleteFiles } from "./delete";

const storage = getStorage();

export async function uploadFile(file: Blob, name: string) {
  const storageRef = ref(storage, name);

  try {
    return await uploadBytes(storageRef, file).then(
      async () => await getDownloadURL(ref(storage, name)).then((url) => url)
    );
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const addFiles = async (files: FileList, uid: string) => {
  const fileUrls: string[] = [];

  const imagesArr = [...Array.from(files)];

  for (let i = 0; i < imagesArr.length; i++) {
    const fileName = crypto.randomUUID();

    let result: string | false = false;
    if (isExp(uid)) {
      result = await uploadFile(imagesArr[i], `exp/${fileName}`);
    } else {
      result = await uploadFile(imagesArr[i], `story/${fileName}`);
    }
    if (!result) {
      await deleteFiles(fileUrls);
      return false;
    }
    fileUrls.push(result);
  }
  return fileUrls;
};

export const addFile = async (file: File, uid: string) => {
  const fileName = crypto.randomUUID();

  let result: string | false = false;

  if (isExp(uid)) {
    result = await uploadFile(file, `exp/${fileName}`);
  } else {
    result = await uploadFile(file, `story/${fileName}`);
  }

  if (!result) return false;

  return result;
};
