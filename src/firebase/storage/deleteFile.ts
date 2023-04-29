import { getStorage, ref, deleteObject } from "firebase/storage";

const storage = getStorage();

export default async function deleteFile(name: string) {
  const storageRef = ref(storage, name);

  try {
    deleteObject(storageRef);
  } catch (error) {
    console.log(error);
  }
}
