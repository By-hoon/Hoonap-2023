import { getStorage, ref, deleteObject } from "firebase/storage";

const storage = getStorage();

export default async function deleteFile(name: string) {
  let result = null;
  let error = null;

  const storageRef = ref(storage, name);

  try {
    deleteObject(storageRef);
  } catch (e) {
    error = e;
  }

  return { result, error };
}
