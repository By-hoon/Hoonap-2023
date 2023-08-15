import { getStorage, ref, deleteObject } from "firebase/storage";

const storage = getStorage();

export async function deleteFile(name: string) {
  const storageRef = ref(storage, name);

  try {
    deleteObject(storageRef);
  } catch (error) {
    console.log(error);
  }
}

export const deleteFiles = async (fileUrls: string[]) => {
  for (let i = 0; i < fileUrls.length; i++) {
    await deleteFile(fileUrls[i]);
  }
};
